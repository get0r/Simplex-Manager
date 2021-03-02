const { ApplicationError, NotFoundError } = require("../../helpers/error");
const { sendError } = require("../../utils/responseBuilder");

/**
 * a funtion to send a response to the client when error is encountered.
 *
 * @param {Error} err error object to hold all the information about the error
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next the next middleware function to be executed.
 */
const clientErrorHandler = (err, req, res, next) => {
    //check for the type of the error and
    //prepare response based on that.
    if(err instanceof ValidationError) {
        return sendError(res, err.httpCode, `Invalid Input was given.`);
    } else if(err instanceof NotFoundError) {
        return sendError(res, err.httpCode, `Not Found.`);
    } else if(err instanceof ApplicationError) {
        return sendError(res, err.httpCode, `Sorry, something went wrong. try again!`);
    } else {
        //unknown error has happend so try to handle it using the
        //handleAllError middleware
        return next(err);
    }
};

module.exports = clientErrorHandler;