import path from 'node:path'
import { fileURLToPath } from 'node:url'
import he from 'he';
import crypto from 'node:crypto'
import logger from '../util/logger.js';
import { env } from '../config.js';

import eventHub from '../util/eventHub.js'; // your singleton
import { emitChatMessage } from '../util/chatProducer.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default async function routes(fastify) {
    fastify.get('/', async function (request, reply) {
        return reply.view('index.ejs', {

        })
    })

    fastify.get('/humans.txt', function (req, reply) {
        reply.sendFile('humans.txt', path.join(__dirname, '..', 'assets'))
    })

    fastify.post('/chat', async function (req, reply) {
        const { content } = req.body;


        const hmac = crypto.createHmac('sha256', env.SECRET_KEY);
        hmac.update(req.ip);
        const ipHmac = hmac.digest('hex');


        if (!content || typeof content !== 'string') {
            return reply.code(400).send('Missing content');
        }

        // log the chat message
        await fastify.prisma.ChatMessage.create({
            data: {
                content,
                ipHmac
            }
        })

        // broadcast html
        // @see https://github.com/naknomum/solacon
        const solacon = `
            <object type="image/svg+xml" style="width: 24px; height: 24px;" id="svg-obj"
                data="/assets/solacon.svg"
                data-value="${ipHmac}"
                data-rgb="0, 30, 255"
            ></object>
        `;
        const broadcastHtml = `
            <div class="message">
                <strong>${solacon}:</strong> ${he.escape(content)}
            </div>
        `;

        // emit the chat via the eventhub
        emitChatMessage(eventHub, broadcastHtml);



        // const responseHtml = `
        //     <div class="message">
        //         <strong>You:</strong> ${he.escape(content)}
        //     </div>
        // `;

        reply
            .status(200);



    });

    fastify.get('/events', (req, res) => {
        res.sse(eventHub.getAsyncIterator());
    });

}
