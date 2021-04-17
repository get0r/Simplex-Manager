const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const { logger } = require('../config/logger');
const Employee = require("../models/employee.model");
const responseConstants = require('../utils/constants/responseConstants');
const { hashString } = require('../utils/hashGenerator');
const { sendError, sendSuccess } = require('../utils/responseBuilder');



/**
 * a method to register both admin/employee user.
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns success or error message to the client
 */
const registerEmployee = async (req, res) => {
    const userDetail = req.body;
    let isAdmin = false;     //to store what kind of registration is requested admin or employee.

    try {
        //check if admin registration is being requested
        if(req.url.search('admin') !== -1)  isAdmin = true;
        //check if an admin has already been registered.
        const existingEmployee = await Employee.findOne({'isAdmin': isAdmin});

        //dont register if admin already exists.
        if(existingEmployee && isAdmin) return sendError(res, responseConstants.BAD_REQUEST_CODE, 'Unable to register admin due to existging one.');

        //check if the username exists
        const employee = await Employee.findOne({'username': userDetail.username});

        if(!employee) {
            const newPassword = await hashString(userDetail.password);

            //assembling data to save to database.
            const newEmployee = new Employee({
                fname: userDetail.fname,
                lname: userDetail.lname,
                gender: userDetail.gender,
                jobTitle: userDetail.jobTitle,
                phone: userDetail.phone,
                salary: userDetail.salary,
                email: userDetail.email,
                username: userDetail.username,
                password: newPassword,
                isAdmin: isAdmin
            });
            await newEmployee.save();  //writing to the databse
            //generate JWT token since registration is successful
            let tokenPayload = { id: newEmployee._id,  username: newEmployee.username, userType: isAdmin ? 0 : 1 };
            const token = jwt.sign(tokenPayload, config.app.tokenSecret, { expiresIn: '48h' });

            //log registeration success data
            logger.info(`Employee registration successful ---${JSON.stringify(newEmployee)}`);
            //store the token in to the cookie
            res.cookie('token', token, { httpOnly: true, secure: config.app.secureCookie, sameSite: true});
            //strip the password and send the user object to client.
            let employeeObject = await newEmployee.toObject();
            delete employeeObject.password;
            delete employeeObject.__v;

            return sendSuccess(res, employeeObject);
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

const loginEmployee = async (req, res) => {
    const userDetail = req.body;

    try {
        //check if the username exists
        const employee = await Employee.findOne({ 'username': userDetail.username });

        if(employee) {
            //check for password correctness
            const validPass = await bcrypt.compare(userDetail.password, employee.password);

            if(!validPass) return sendError(res, responseConstants.SUCCESS_CODE, 'Incorrect Username or Password!');
            //create token since password was correct.
            let tokenPayload = { id: employee._id, username: employee.username, userType: employee.isAdmin ? 0 : 1 };
            const token = jwt.sign(tokenPayload, config.app.tokenSecret, { expiresIn: '48h' });

            //remove password field to the user object to the client.
            let employeeObject = await employee.toObject();
            delete employeeObject.password;
            delete employeeObject.__v;

            //store the token in to the cookie
            res.cookie('token', token, { httpOnly: true, secure: config.app.secureCookie, sameSite: true});
            return sendSuccess(res, employeeObject);
        }

    }  catch(e) {
        logger.error(`Unable to login employee user due to --- ${e.message}`);
    }

    return sendError(res, responseConstants.SUCCESS_CODE, 'Username or Password Incorrect!');
};


module.exports = {
    loginEmployee,
    registerEmployee,
};