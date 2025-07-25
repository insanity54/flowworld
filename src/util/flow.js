import { poses, transitionsTable, alternatives, mirrors } from "./poses.js";
import { randomOne } from "./random.js";
import logger from './logger.js';

export let mirrorDebt = {};
let forcedNextPose = null;

export function getRandomPose() {
    return randomOne(poses)
}

export function getPoseByName(name) {
    logger.debug(`getPoseByName. name=${name}`)
    const pose = poses.find(p => p.name === name);
    if (!pose) throw new Error(`pose ${name} not found.`);
    return pose
}

export function getNextPose(currentPoseName = getRandomPose().name, options = {}) {
    logger.trace('getNextPose');

    const transitions = transitionsTable[currentPoseName];
    if (!transitions) {
        throw new Error(`transitions not found for ${currentPoseName}`);
    }

    // Handle mirror debt tracking
    const mirrorOfCurrent = mirrors[currentPoseName];
    if (mirrorOfCurrent) {
        mirrorDebt[mirrorOfCurrent] = 1;
        forcedNextPose = mirrorOfCurrent; // force repayment on next transition
    }

    let nextName;

    // FORCE repayment of mirror debt if it's one of the valid transitions
    if (forcedNextPose) {
        const valid = transitions.find(t => t.next === forcedNextPose);
        if (valid) {
            nextName = forcedNextPose;
            forcedNextPose = null;
        }
    }

    if (!nextName) {
        // Proceed with normal weighted logic
        const weightedTransitions = transitions.map(t => {
            const debt = mirrorDebt[t.next] || 0;
            const boost = debt > 0 ? debt * 0.9 : 0;
            return { ...t, weight: t.weight + boost };
        });

        const totalWeight = weightedTransitions.reduce((sum, t) => sum + t.weight, 0);
        const rand = Math.random() * totalWeight;

        let cumulative = 0;
        for (const t of weightedTransitions) {
            cumulative += t.weight;
            if (rand < cumulative) {
                nextName = t.next;
                break;
            }
        }

        if (!nextName) {
            throw new Error(`No valid next pose found from ${currentPoseName}`);
        }
    }

    // Repay mirror debt if matched
    if (mirrorDebt[nextName]) {
        mirrorDebt[nextName] = 0;
    }

    // Adjust difficulty
    const alt = alternatives[nextName];
    if (alt) {
        if (options.difficulty === 'easier' && alt.easier?.length) {
            nextName = alt.easier[0];
        } else if (options.difficulty === 'harder' && alt.harder?.length) {
            nextName = alt.harder[0];
        }
    }

    const pose = getPoseByName(nextName);
    logger.debug(`pose selected. pose=${JSON.stringify(pose)}. mirrorDebt=${JSON.stringify(mirrorDebt)}`);

    return pose;
}

