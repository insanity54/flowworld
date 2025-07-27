import { env } from './config.js';
import { buildApp } from "./app.js";
import logger from './util/logger.js';
import eventHub from './util/eventHub.js';
import { startPoseProducer } from './util/poseProducer.js';
import he from 'he';





// Start event sources
startPoseProducer(eventHub);


// setTimeout(() => {
//     const pose = { name: 'bridge', displayName: 'Bridge Pose', difficulty: 2 }
//     eventHub.emit('pose', `<div class="pose" data-pose='${JSON.stringify(pose)}'>${pose.displayName}</div>`)
// }, 5000)


// setTimeout(() => {
//     const content = 'this is a test message';
//     const chat = `<div class="message">
//                     <strong>You:</strong> ${he.escape(content)}
//                 </div>`
//     eventHub.emit('message', chat)
// }, 3000)
// setTimeout(() => {
//     const content = 'this is a test message';
//     const chat = `<div class="message">
//                     <strong>You:</strong> ${he.escape(content)}
//                 </div>`
//     eventHub.emit('message', chat)
// }, 6000)
// setTimeout(() => {
//     const content = 'this is a test message';
//     const chat = `<div class="message">
//                     <strong>You:</strong> ${he.escape(content)}
//                 </div>`
//     eventHub.emit('message', chat)
// }, 9000)





// Start fastify
const app = buildApp()
const port = env.PORT
app.listen({ port, host: '0.0.0.0' })
logger.info(`app listening on port ${port}`)

