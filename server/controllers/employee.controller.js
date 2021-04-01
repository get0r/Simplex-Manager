const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const { logger } = require('../config/logger');
const Employee = require("../models/employee.model");
const responseConstants = require('../utils/constants/responseConstants');
const { sendError, sendSuccess } = require('../utils/responseBuilder');


/**
 * a method to find a user and validate him using the username and password for login.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns a success or error message to the client
 */

const loginEmployee = async (req, res) => {
    const userDetail = req.body;

    try {
        //check if the username exists
        const employee = await Employee.findOne({'username': userDetail.username, 'isAdmin': true});

        if(employee) {
            //check for password correctness
            const validPass = await bcrypt.compare(userDetail.password, employee.password);

            if(!validPass) return sendError(res, responseConstants.SUCCESS_CODE, 'Username or Password Incorrect!');
            //create token since password was correct.
            let tokenPayload = { id: employee._id, userType: 0 };
            const token = jwt.sign(tokenPayload, config.app.tokenSecret, { expiresIn: '48h' });

            //remove password field to the user object to the client.
            let admin = employee.toObject();
            delete admin.password;
            delete admin.__v;

            //store the token in to the cookie
            res.cookie('token', token, { httpOnly: true, secure: config.app.secureCookie, sameSite: true});
            return sendSuccess(res, admin);
        }

    }  catch(e) {
        logger.error(`Unable to login admin user due to --- ${e.message}`);
    }

    return sendError(res, responseConstants.SUCCESS_CODE, 'Username or Password Incorrect!');
};

module.exports = {
    loginEmployee
};