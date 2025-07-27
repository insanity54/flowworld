import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma.js'
import routes from './plugins/routes.js'
import fastifyStatic from '@fastify/static'
import fastifyFavicon from 'fastify-favicon'
import fastifyFormbody from '@fastify/formbody'
import path from 'node:path'
import fastifyView from "@fastify/view";
import ejs from 'ejs'
import { fileURLToPath } from 'node:url'
import { FastifySSEPlugin } from "fastify-sse-v2";
import fastifySecureSession from '@fastify/secure-session';
import { env } from './config.js';
import fastifyRateLimit from '@fastify/rate-limit';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function buildApp() {
    const app = Fastify()

    app.register(fastifyRateLimit, {
        max: 180,
        timeWindow: '1 minute'
    })

    app.register(fastifySecureSession, {
        // the name of the attribute decorated on the request-object, defaults to 'session'
        sessionName: 'session',
        // the name of the session cookie, defaults to value of sessionName
        cookieName: 'multiplayer_yoga',
        // adapt this to point to the directory where secret-key is located
        key: Buffer.from(env.COOKIE_SECRET, 'hex'),
        // the amount of time the session is considered valid; this is different from the cookie options
        // and based on value within the session.
        expiry: 24 * 60 * 60, // Default 1 day
        cookie: {
            path: '/'
            // options for setCookie, see https://github.com/fastify/fastify-cookie
        }
    })

    app.register(fastifyFavicon, { path: './src/assets' })
    app.register(fastifyFormbody) // for htmx
    // app.register(fastifyFlash)
    app.register(fastifyView, {
        engine: {
            ejs
        },
        root: path.join(__dirname, "views"),
    })

    app.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/', // optional: default '/'
        constraints: {} // optional: default {}
    })

    app.register(fastifyStatic, {
        root: path.join(__dirname, 'assets'),
        prefix: '/assets/',
        decorateReply: false // the reply decorator has been added by the first plugin registration
    })

    app.register(FastifySSEPlugin)
    app.register(prismaPlugin)
    app.register(routes)

    return app
}

