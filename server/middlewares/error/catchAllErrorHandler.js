const responseConstants = require("../../utils/constants/responseConstants");

/**
 *
 * @param {Error} err error object
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next the next middleware function to be executed.
 */
const catchAllErrorHandler = (err, req, res, next) => {
    return res.status(responseConstants.SERVER_ERROR_CODE).json({
        success: false,
        message: 'Sorry, something went wrong!'
    });
    //since this is the last handler we will stop chaining
    //middlewares to execute.
};

module.exports = catchAllErrorHandler;