import he from 'he';
import { nanoid } from 'nanoid';
import { getNextPose } from './flow.js';


export function randomOne(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function randomEvent() {
    const isMessage = Math.random() < 0.5; // 50% chance for either event
    if (isMessage) {
        return {
            event: 'message',
            data: `<div class="message">${he.escape(`Some message ${nanoid()}`)}</div>`
        };
    } else {
        const pose = getNextPose()
        console.log(`pose selected. pose=${JSON.stringify(pose)}`)
        return {
            event: 'pose',
            data: `<div class="pose" data-pose='${JSON.stringify(pose)}'>${pose.displayName}</div>`
        };
    }
}
