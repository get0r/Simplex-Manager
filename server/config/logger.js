const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, printf } = format;

//log format to printed on files and the console.
const logFormat = printf(({level, message, label, timestamp}) => {
    //if the log message passed to the logger
    //contains `HTTP` then it's a morgan req-res log
    if(message.search('userAgent') != -1)
        label = 'morgan';
    else
        label = 'winston';

    return JSON.stringify({
        level: level.slice(5, level.length - 5),    //slicing out the word 'warn' or 'error' only.
        label,
        timestamp,
        message
    });
});

//path specification for storing log files.
let basePath;

if(process.env.NODE_ENV == 'production')
    basePath = `${__dirname}/../logs`;
else
    basePath = `${require('os').homedir()}/logs`;

//configure the logger so that it only prints messages below the level of info, like
//ERROR, WARN
const loggerConfiguration = {
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        label(),
        colorize(),
        logFormat
        ),
    /**
     * log error level logs to the console, error.json and combined.json
     * log other levels only to the combined.json file and
     * finally log uncaughtException and rejectedPromises to exceptions.json
     * and rejections.json respectively.
     */
    transports: [
        new transports.Console({
            level: 'info'
        }),
        new transports.File({
            filename: `${basePath}/error.json`,
            maxsize: 5242880,   //5MB maximum file size
            level: 'error'
        }),
        new transports.File({
            filename: `${basePath}/combined-${new Date()}.json`,
            maxsize: 5242880,   //5MB maximum file size
            level: 'info'
        }),
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: `${basePath}/exceptions.json`,
            maxsize: 5242880,
        })
    ],
    rejectionHandlers: [
        new transports.Console(),
        new transports.File({
            filename: `${basePath}/rejections.json`,
            maxsize: 5242880,
        })
    ],
    exitOnError: false
};

const logger = createLogger(loggerConfiguration);

//a stream to make morgan logs pass through winston.
const httpLoggerStream = {
    write: function(message) {
        logger.info(JSON.stringify(message).replace(/"/g,""));
    }
};

//httpLogger custom format
const httpLoggerFromat = `{ method: :method, url: :url, remoteIp: :remote-addr,
    remoteUser: :remote-user, httpVersion: :http-version, status: :status,
    contentLength: :res[content-length], responseTime: :response-time ms,
    referrer: :referrer, userAgent: :user-agent}`.replace(/\n/g, "");


//configure HTTP request and response only logger
const httpLogger = morgan(httpLoggerFromat, {stream: httpLoggerStream});

module.exports = {
    logger,
    httpLogger
};
