const { F_OK } = require('constants');
const jwt = require('jsonwebtoken');
const path = require('path');

const config = require('../../config/config');
const { logger } = require('../../config/logger');
const { AuthorizationError } = require('../../helpers/error');
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

    if(!token) return next(new AuthorizationError(path.basename(__filename), 'token was not provided!!!'));

    try {
        let verifiedUser = jwt.verify(token, config.app.tokenSecret);
        //token is not valid
        if(!verifiedUser) return sendError(res, responseConstants.SUCCESS_CODE, 'Unauthorized access.');

        req.userId = verifiedUser.id;       //_id stored in the token
        req.userType = verifiedUser.userType;       //admin or employee 0 or 1 respectively.
        //log auth success indicator
        logger.info(`Auth successful for ---${JSON.stringify({userId: verifiedUser.id, userType: verifiedUser.userType})}`);

        //continue to the route end point
        return next();

    } catch (e) {
        return next(new AuthorizationError(path.basename(__filename), e.message));
    }
};


module.exports = {
    authUser
};