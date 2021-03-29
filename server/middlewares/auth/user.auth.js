const jwt = require('jsonwebtoken');
const path = require('path');

const config = require('../../config/config');
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

    if(!token) next(new AuthorizationError('token was not provided!!!'));

    try {
        let verifiedUser = jwt.verify(token, config.app.tokenSecret);
        //token is not valid
        if(!verifiedUser) return sendError(res, responseConstants.SUCCESS_CODE, 'Please Login First!!');

        req.userId = verifiedUser.id;       //_id stored in the token
        req.userType = verifiedUser.userType;       //admin or employee 0 or 1 respectively.
        //continue to the route end point
        next();

    } catch (e) {
        next(new AuthorizationError(path.basename(__filename), e.message));
    }
};


module.exports = {
    authUser
};