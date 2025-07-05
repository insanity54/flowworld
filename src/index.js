import { env } from './config.js';
import { buildApp } from "./app.js";

const app = buildApp()

app.listen({ port: env.PORT, host: '0.0.0.0' })