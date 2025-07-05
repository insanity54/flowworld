import EventEmitter from 'events';

import { nanoid } from 'nanoid';
import { sleep } from '../util/timers.js'
import { randomEvent } from '../util/random.js'


class SharedEventSource {
    constructor() {
        this.eventEmitter = new EventEmitter();
        this.start();
    }

    async start() {
        while (true) {
            await sleep(25);
            const event = randomEvent();
            this.eventEmitter.emit('event', event);
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
