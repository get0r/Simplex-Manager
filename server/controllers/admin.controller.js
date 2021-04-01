const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { logger } = require('../config/logger');

const Employee = require("../models/employee.model");
const responseConstants = require("../utils/constants/responseConstants");
const { hashString } = require('../utils/hashGenerator');
const { sendError, sendSuccess } = require("../utils/responseBuilder");

/**
 * a method to register an admin user.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns success or error message to the client
 */
const registerAdmin = async (req, res) => {
    const userDetail = req.body;

    try {
        //check if the username exists
        const adminUser = await Employee.findOne({'username': userDetail.username});

        if(!adminUser) {
            const newPassword = await hashString(userDetail.password);

            //assembling data to save to database.
            const newAdmin = new Employee({
                fname: userDetail.fname,
                lname: userDetail.lname,
                gender: userDetail.gender,
                jobTitle: userDetail.jobTitle,
                phone: userDetail.phone,
                salary: userDetail.salary,
                email: userDetail.email,
                username: userDetail.username,
                password: newPassword,
                isAdmin: true
            });
            await newAdmin.save();  //writing to the databse
            //generate JWT token since registration is successful
            let tokenPayload = { id: newAdmin._id, userType: 0 };
            const token = jwt.sign(tokenPayload, config.app.tokenSecret, { expiresIn: '48h' });

            //log registeration success data
            logger.info(`admin registration successful ---${JSON.stringify(newAdmin)}`);
            //store the token in to the cookie
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: true});
            return sendSuccess(res, 'Registration Successful');
        }
    } catch(e) {
        logger.error(`Unable to register admin user due to --- ${e.message}`);
        return sendError(res, responseConstants.SERVER_ERROR_CODE, 'Sorry something went wrong. try later!');
    }
    return sendError(res, responseConstants.SUCCESS_CODE, 'Username already taken!');
};


/**
 * a method to find a user and validate him using the username and password for login.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns a success or error message to the client
 */

const loginAdmin = async (req, res) => {
    const userDetail = req.body;

    try {
        //check if the username exists
        const adminUser = await Employee.findOne({'username': userDetail.username, 'isAdmin': true});

        if(adminUser) {
            //check for password correctness
            const validPass = await bcrypt.compare(userDetail.password, adminUser.password);

            if(!validPass) return sendError(res, responseConstants.SUCCESS_CODE, 'Username or Password Incorrect!');
            //create token since password was correct.
            let tokenPayload = { id: adminUser._id, userType: 0 };
            const token = jwt.sign(tokenPayload, config.app.tokenSecret, { expiresIn: '48h' });

            //store the token in to the cookie
            res.cookie('token', token, { httpOnly: true, secure: config.app.secureCookie, sameSite: true});
            return sendSuccess(res, 'Login Successful');
        }
    }catch(e) {
        logger.error(`Unable to login admin user due to --- ${e.message}`);
    }
    return sendError(res, responseConstants.SUCCESS_CODE, 'Username or Password Incorrect!');
};


module.exports = {
    registerAdmin,
    loginAdmin
};