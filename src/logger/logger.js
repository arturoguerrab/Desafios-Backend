import winston from 'winston'
import dotenv from 'dotenv'
dotenv.config()

const custom = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        debug: 'cyan bold',
        http: 'green bold',
        info: 'green bold',
        warning: 'yellow bold',
        error: 'magenta bold',
        fatal: 'red bold'
    }
}

winston.addColors(custom.colors)

const createLogger = env => {
    if (env === 'PROD') {
        return winston.createLogger({
            levels: custom.levels,
            transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: './src/logger/errors.log',
                    level: 'error',
                    format: winston.format.simple()
                })
            ]
        })
    } else {
        return winston.createLogger({
            levels: custom.levels,
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
            ]
        })
    }
}

export default createLogger(process.env.ENVIRONMENT)