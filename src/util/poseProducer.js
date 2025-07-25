import { sleep } from '../util/timers.js';
import { getNextPose } from './flow.js';

export async function startPoseProducer(eventHub) {
    while (true) {
        const pose = getNextPose();
        eventHub.emit('pose', `<div class="pose" data-pose='${JSON.stringify(pose)}'>${pose.displayName}</div>`);
        await sleep(4200);
    }
}