import { sleep } from '../util/timers.js';
import { getNextPose } from './flow.js';
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaClient } from '@prisma/client';
import { env } from '../config.js';

const prisma = new PrismaClient().$extends(withAccelerate())

export async function startPoseProducer(eventHub) {
    while (true) {
        const pose = getNextPose();

        await prisma.globalState.upsert({
            where: { id: 'singleton' },
            update: { poseName: pose.name },
            create: { id: 'singleton', poseName: pose.name },
        });

        eventHub.emit('pose', `<div class="pose" data-pose='${JSON.stringify(pose)}'>${pose.displayName}</div>`);
        await sleep(env.POSE_INTERVAL);
    }
}