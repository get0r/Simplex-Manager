const path = require('path');


const { ValidationError } = require("../../helpers/error");
const { loginSchema, schemaOptions, adminSchema } = require('../../utils/validationSchema/user.schema');

/**
 * a method to validate the data sent for login purpose that is username, password
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next the next middleware function in the chain
 */

const validateLoginData = async (req, res, next) => {
    try {
        const userLoginDetail = req.body;
        const result = await loginSchema.validateAsync(userLoginDetail, schemaOptions);
        //go on to the next function since it's successful on the validation
        return next();

    } catch(e) {
        //filtering out the message part from the details.
        const errorMessage = e.details.map(details => details.message);
        //throw the error for logging

        const validationError = new ValidationError(path.basename(__filename), errorMessage);
        return next(validationError);
    }
};


/**
 * a method to validate the data sent for registration purpose that is username, password...
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next the next middleware function in the chain
 */

 const validateRegisterData = async (req, res, next) => {
    try {
        const userRegisterData = req.body;
        const result = await adminSchema.validateAsync(userRegisterData, schemaOptions);
        //go on to the next function since it's successful on the validation
        next();

    } catch(e) {
        //filtering out the message part from the details.
        const errorMessage = e.details.map(details => details.message);
        //throw the error for logging

        const validationError = new ValidationError(path.basename(__filename), errorMessage);
        next(validationError);
    }
};


module.exports = {
    validateLoginData,
    validateRegisterData
};