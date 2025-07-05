// ./src/config.js
import { z } from 'zod';
import '@dotenvx/dotenvx/config.js'

const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().url(),
    ORIGIN: z.string()
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data

