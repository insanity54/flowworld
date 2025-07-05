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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function buildApp() {
    const app = Fastify()


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

