const express = require('express');

const { loginEmployee, registerEmployee } = require('../controllers/employee.controller');
const { authUser, isAdmin } = require('../middlewares/auth/employee.auth');
const { validateLoginData, validateRegisterData } = require('../middlewares/validator/employee.validator');


const employeeRouter = express.Router();

/**
 * @route a route for the login feature of Employees including admin,
 * @validateLoginData- login data(username, password) validation middleware.
 * @loginAdmin- login service route destination method.
 */
employeeRouter.post('/login', validateLoginData, loginEmployee);

/**
 * @route a route to register admin only.
 * @validateRegisterData- regsitering data(name, email ...) validator middleware.
 * @registerAdmin- register servive route end point.
 */
employeeRouter.post('/admin/register', validateRegisterData, registerEmployee);

/**
 * @route a route to register Employee only and is requested by admin only (employees can't register themselves).
 * @authUser user authentiating middleware (verfying token).
 * @isAdmin is the authenticated user an admin (checker).
 * @validateRegisterData regsitering data(name, email ...) validator middleware.
 * @registerEmployee register servive route end point.
 */
employeeRouter.post('/employee/register', authUser, isAdmin, validateRegisterData, registerEmployee);

module.exports = employeeRouter;