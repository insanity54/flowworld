import fp from 'fastify-plugin'
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends(withAccelerate())

export default fp(async (fastify, opts) => {

    await prisma.$connect()

    fastify.decorate('prisma', prisma)

    fastify.addHook('onClose', async (app) => {
        await app.prisma.$disconnect()
    })
})
