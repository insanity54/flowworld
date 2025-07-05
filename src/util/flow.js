import { poses, transitionsTable, alternatives, mirrors } from "./poses.js";
import { randomOne } from "./random.js";

const mirrorDebt = {};

export function getRandomPose() {
    return randomOne(poses)
}

export function getPoseByName(name) {
    // console.log(`getPoseByName. name=${name}`)
    const pose = poses.find(p => p.name === name);
    if (!pose) throw new Error(`pose ${name} not found.`);
    return pose
}


export function getNextPose(currentPoseName = getRandomPose().name, options = {}) {
    // console.log(`getNextPose currentPoseName=${currentPoseName}`)
    const transitions = transitionsTable[currentPoseName];
    if (!transitions) {
        throw new Error(`transistions not found for ${currentPoseName}`)
        return null;
    }

    // Handle mirror debt tracking
    const mirrorOfCurrent = mirrors[currentPoseName];
    if (mirrorOfCurrent) {
        mirrorDebt[mirrorOfCurrent] = (mirrorDebt[mirrorOfCurrent] || 0) + 1;
    }

    // Build adjusted weights
    const weightedTransitions = transitions.map(t => {
        const debt = mirrorDebt[t.next] || 0;
        const boost = debt > 0 ? debt * 0.3 : 0;
        return { ...t, weight: t.weight + boost };
    });

    // Normalize weights
    const totalWeight = weightedTransitions.reduce((sum, t) => sum + t.weight, 0);
    const rand = Math.random() * totalWeight;

    let cumulative = 0;
    let nextName;
    for (const t of weightedTransitions) {
        cumulative += t.weight;
        if (rand < cumulative) {
            nextName = t.next;
            break;
        }
    }

    // Pay mirror debt if matched
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

    return getPoseByName(nextName);
}
