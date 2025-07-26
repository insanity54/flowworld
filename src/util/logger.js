import pino from 'pino'
import { env } from '../config.js'

let hooks

if (env.NODE_ENV === 'test') {
    const { prettyFactory } = require('pino-pretty')
    const prettify = prettyFactory({ sync: true, colorize: true })
    hooks = {
        streamWrite: (s) => {
            console.log(prettify(s)) // Mirror to console.log during tests. @see https://github.com/pinojs/pino/issues/2148
            return s
        },
    }
}

const isProd = env.NODE_ENV === 'production'
const logger = pino({
    level: env.LOG_LEVEL,
    ...(isProd
        ? {} // no transport needed in production if logging to JSON
        : {
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    sync: true, // avoid using thread-stream in test/dev
                },
            },
        }),
})


export default logger