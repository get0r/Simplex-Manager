const jwt = require('jsonwebtoken');
const path = require('path');

const config = require('../../config/config');
const { logger } = require('../../config/logger');
const { AuthorizationError, AuthenticationError } = require('../../helpers/error');
const responseConstants = require('../../utils/constants/responseConstants');
const { sendError } = require('../../utils/responseBuilder');


/**
 * a method to verify jwt token and auth user.
 * @param {Object} req request object.
 * @param {Object} res response object.
 *
 * @param {Function} next the next function middleware.
 */
const authUser = (req, res, next) => {
    let token = req.cookies.token;

    if(!token) return next(new AuthenticationError(path.basename(__filename), 'token was not provided!!!'));

    try {
        let verifiedUser = jwt.verify(token, config.app.tokenSecret);
        //token is not valid
        if(!verifiedUser) return sendError(res, responseConstants.SUCCESS_CODE, 'Unauthorized access.');
        req.user = {};
        req.user.userId = verifiedUser.id;       //_id stored in the token
        req.user.username = verifiedUser.username;
        req.user.userType = verifiedUser.userType;       //admin or employee 0 or 1 respectively.

        //log auth success indicator
        logger.info(`Auth successful for ---${JSON.stringify({userId: verifiedUser.id, userType: verifiedUser.userType ? 'employee' : 'admin'})}`);

        //continue to the route end point
        return next();

    } catch (e) {
        return next(new AuthenticationError(path.basename(__filename), e.message));
    }
};


/**
 * a method to identify the user type whether it's Admin(manager) or employee.
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Function} next the next middleware function
 */
const isAdmin = (req, res, next) => {
    const userType = req.user.userType;

    if(userType == undefined || userType == null) return next(new AuthorizationError(path.basename(__filename), 'User type not found in req.userType'));

    if(userType != 0) return next(new AuthorizationError(path.basename(__filename), 'User type is not admin.'));

    //user is admin so proceed to authorization finishing.
    return next();
};

module.exports = {
    authUser,
    isAdmin
};