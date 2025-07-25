import logger from "../util/logger.js";

// chatProducer.js
export function emitChatMessage(eventHub, html) {

    logger.debug(`>>> emitChatMessage() with html = ${html} `)

    eventHub.emit('message', html);
}