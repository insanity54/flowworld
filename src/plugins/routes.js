import path from 'node:path'
import { fileURLToPath } from 'node:url'
import he from 'he';
import crypto from 'node:crypto'
import logger from '../util/logger.js';
import { env } from '../config.js';
import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection';
import { nanoid } from 'nanoid';

import eventHub from '../util/eventHub.js'; // your singleton
import { emitChatMessage } from '../util/chatProducer.js';
import { poses } from '../util/poses.js';
import { moderate } from '../util/chatFilter.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


export default async function routes(fastify) {
    fastify.get('/', async function (request, reply) {
        const gs = await fastify.prisma.GlobalState.findUnique({
            where: {
                id: 'singleton'
            }
        })
        const pose = poses.find((p) => p.name === gs.poseName)
        request.session.get('id')

        if (!request.session.get('id')) {
            // Set it only if it's not already set
            request.session.set('id', nanoid());
        }

        return reply.view('index.ejs', {
            initialPose: pose
        })
    })

    fastify.get('/humans.txt', function (request, reply) {
        reply.sendFile('humans.txt', path.join(__dirname, '..', 'assets'))
    })

    fastify.post('/chat', async function (request, reply) {
        const { content } = request.body;

        const id = request.session.get('id')




        if (!content || typeof content !== 'string') {
            return reply.code(400).send('Missing content');
        }

        // log the chat message
        await fastify.prisma.ChatMessage.create({
            data: {
                content,
                userId: id
            }
        })

        // moderate
        logger.debug(`moderating ${content} via LLM...`);
        const result = await moderate(content)


        const avatar = createAvatar(funEmoji, {
            seed: id,
            radius: 50,
            size: 24,
        });

        const svg = avatar.toString();


        if (result?.allowed === false) {
            logger.debug(`Filtered message from ${id}: ${result.reason}, ${result.category}`);

            const filtered = `<div class="message">${svg}: *filtered* (${result.category})</div>`

            return reply.status('201').send(filtered)

        } else {
            logger.debug("Allowed.");
        }


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

    fastify.get('/events', (request, reply) => {
        reply.sse(eventHub.getAsyncIterator());
    });

    fastify.get('/health', (request, reply) => {
        reply.send('OK');
    });

}
