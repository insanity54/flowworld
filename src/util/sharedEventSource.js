import EventEmitter from 'events';

import { sleep } from '../util/timers.js'
import { getNextPose } from './flow.js';

class SharedEventSource {
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.start();
    }

    async start() {
        while (true) {
            // const event = randomEvent();
            const pose = getNextPose()
            const event = {
                event: 'pose',
                data: `<div class="pose" data-pose='${JSON.stringify(pose)}'>${pose.displayName}</div>`
            };
            this.eventEmitter.emit('event', event);
            await sleep(42000);
        }
    }

    getAsyncIterator() {
        const emitter = this.eventEmitter;
        const eventName = 'event';

        const queue = [];
        let resolveNext;
        let listening = true;

        const onEvent = (data) => {
            if (resolveNext) {
                resolveNext({ value: data, done: false });
                resolveNext = null;
            } else {
                queue.push(data);
            }
        };

        emitter.on(eventName, onEvent);

        return {
            async next() {
                if (!listening) return { done: true };

                if (queue.length > 0) {
                    return { value: queue.shift(), done: false };
                }

                return new Promise(resolve => {
                    resolveNext = resolve;
                });
            },
            return() {
                listening = false;
                emitter.off(eventName, onEvent);
                return { done: true };
            },
            [Symbol.asyncIterator]() {
                return this;
            }
        };
    }
}

// Export a singleton instance
export default new SharedEventSource();
