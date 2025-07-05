// plugins/fixSSE.js
import type { FastifyPluginAsync } from 'fastify'
import FastifySSEPluginOriginal from 'fastify-sse-v2'

const FastifySSEPlugin = FastifySSEPluginOriginal as FastifyPluginAsync

export default FastifySSEPlugin
