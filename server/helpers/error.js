const errorConstants = require('../utils/constants/errorConstants');
/**
 * a Parent class for Error detection
 */
class ApplicationError extends Error {
    constructor(httpCode, fileName, message) {
        super(message);
        this.httpCode = httpCode;
        this.fileName = fileName;
        this.isOperational = true;

        //creates stack property on the object.
        ApplicationError.captureStackTrace(this, this.constructor);
    }

    get gethttpCode() {
        return this.httpCode;
    }

    get getfileName() {
        return this.fileName;
    }
}

class ValidationError extends ApplicationError {
    constructor(fileName, message, httpCode = errorConstants.BAD_REQUEST_CODE) {
        super(httpCode, fileName, message);
    }
}

class NotFoundError extends ApplicationError {
    constructor(fileName, message, httpCode = errorConstants.NOT_FOUND_CODE) {
        super(httpCode, fileName, message);
    }
}
module.exports = {
    ApplicationError,
    ValidationError,
    NotFoundError
};