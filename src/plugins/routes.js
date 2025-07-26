import path from 'node:path'
import { fileURLToPath } from 'node:url'
import he from 'he';
import crypto from 'node:crypto'
import logger from '../util/logger.js';
import { env } from '../config.js';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';


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

        console.log(req)
        const hmac = crypto.createHmac('sha256', env.SECRET_KEY);
        hmac.update(req.realIp);
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


        const avatar = createAvatar(funEmoji, {
            seed: ipHmac,
            radius: 50,
            size: 24,
        });

        const svg = avatar.toString();


        const broadcastHtml = `
            <div class="message">
                ${svg}: ${he.escape(content)}
            </div>
        `;

        // emit the chat via the eventhub
        emitChatMessage(eventHub, broadcastHtml);


        reply
            .status(200);



    });

    fastify.get('/events', (req, res) => {
        res.sse(eventHub.getAsyncIterator());
    });

}
