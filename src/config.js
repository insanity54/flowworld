// ./src/config.js
import { z } from 'zod';
import dotenv from '@dotenvx/dotenvx'

dotenv.config({
    path: ".env.development.local"
})


const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.url(),
    ORIGIN: z.string(),
    LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
    COOKIE_SECRET: z.string(),
    INFERENCE_API_KEY: z.string(),
    POSE_INTERVAL: z.coerce.number().default(42000),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:', z.treeifyError(parsed.error));
    process.exit(1);
}

export const env = parsed.data

