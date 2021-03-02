const logger = require('../../config/logger');;

/**
 * a function to log a message when an error is encountered.
 *
 * @param {Error} err Error object to hold the error information.
 * @param {Object} req request object.
 * @param {Object} res resposne object.
 * @param {Function} next the next middleware function to be executed next.
 */

const errorLogger = (err, req, res, next) => {
    const errorMessage = JSON.stringify({
        fileName: err.fileName,
        type: err.constructor.name,
        message: err.message,
    }).replace(/"/g,"'");

    //log the error as a warning to the console
    logger.warn(errorMessage);

    return next(err);
};

module.exports = errorLogger;