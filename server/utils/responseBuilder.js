const responseConstants = require("./constants/responseConstants");


/**
 * a function to send Success response to the client.
 *
 * @param {Object} res response object of the client
 * @param {Any} payload a message to be sent to the client- can be Object or String ...
 */
const sendSuccess = (res, payload) => {
    return res.status(responseConstants.SUCCESS_CODE).json({
        success: true,
        message: payload
    });
};

/**
 * a function to send Error response to the client specified by the res object.
 * @param {Object} res response object
 * @param {String} httpCode the status code for the particular response
 * @param {Any} payload a message to be sent along to the client.
 */

const sendError = (res, httpCode, payload) => {
    return res.status(httpCode).json({
        success: false,
        message: payload
    });
};

module.exports = {
    sendError,
    sendSuccess
};