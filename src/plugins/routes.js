import path from 'node:path'
import { fileURLToPath } from 'node:url'
import he from 'he';
import crypto from 'node:crypto'
import sharedEventSource from '../util/sharedEventSource.js';

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
        const { message } = req.body;

        const ip = req.ip;
        const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

        if (!message || typeof message !== 'string') {
            return reply.code(400).send('Missing message');
        }

        // log the chat message
        await fastify.prisma.ChatMessage.create({
            data: {
                content: message,
                ipHash
            }
        })

        const responseHtml = `
            <div class="message">
                <strong>You:</strong> ${he.escape(message)}
            </div>
        `;

        reply
            .type('text/html')
            .send(responseHtml);
    });

    fastify.get('/events', (req, res) => {
        res.sse(sharedEventSource.getAsyncIterator());
    });

}
