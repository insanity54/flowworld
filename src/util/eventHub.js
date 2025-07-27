// eventHub.js
import { EventEmitter } from 'events';
import logger from '../util/logger.js';

class EventHub {
    constructor() {
        this.emitter = new EventEmitter();
    }

    emit(eventName, html) {
        logger.trace(`eventHub emitting eventName=${eventName} html=${html}`)
        this.emitter.emit('event', { event: eventName, data: html });
    }

    async *getAsyncIterator() {
        const queue = [];
        const onEvent = (payload) => {
            logger.trace('event received for SSE', payload);
            queue.push(payload); // must be { event, data }
        };
        this.emitter.on('event', onEvent);

        try {
            while (true) {
                while (queue.length === 0) {
                    await new Promise(resolve => setImmediate(resolve));
                }
                const html = queue.shift();
                logger.trace('yielding html to SSE stream', html);
                yield html;
            }
        } finally {
            logger.trace('SSE iterator cleanup');
            this.emitter.off('event', onEvent);
        }
    }
}

export default new EventHub();
