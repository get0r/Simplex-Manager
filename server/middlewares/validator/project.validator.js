const path = require('path');

const { schemaOptions } = require("../../utils/validationSchema/employee.schema");
const { projectSchema } = require("../../utils/validationSchema/projectSchema");
const { ValidationError } = require("../../helpers/error");

/**
 * a method to validate project creation data against joi schema.
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next next middleware function in the chain.
 */
const validateProjectData = async (req, res, next) => {
    try {
        const projectDetail = req.body;
        //try validating
        await projectSchema.validateAsync(projectDetail, schemaOptions);
        //all goes well
        return next();
    } catch(e) {
        //filtering out the message part from the details.
        const errorMessage = e.details.map(details => details.message);
        //throw the error for logging

        const validationError = new ValidationError(path.basename(__filename), errorMessage);
        return next(validationError);
    }
};

module.exports = {
    validateProjectData
};