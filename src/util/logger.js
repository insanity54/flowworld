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

const logger = pino({
    level: env.LOG_LEVEL,
    transport: {
        target: env.NODE_ENV === 'production' ? 'pino' : 'pino-pretty',
        options: {
            colorize: env.NODE_ENV === 'production' ? false : true,
        }
    },
    ...(hooks ? { hooks } : {})
})

export default logger