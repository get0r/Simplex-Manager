const express = require('express');

const { loginEmployee, registerEmployee } = require('../controllers/employee.controller');
const { getAllOngoingProjects, getEmployeeOngoingProjects } = require('../controllers/project.controller');
const { authUser, isAdmin } = require('../middlewares/auth/employee.auth');
const { validateLoginData, validateRegisterData } = require('../middlewares/validator/employee.validator');


const employeeRouter = express.Router();

/**
 * @route a route for the login feature of Employees including admin,
 * @validateLoginData login data(username, password) validation middleware.
 * @loginAdmin login service route destination method.
 */
employeeRouter.post('/login', validateLoginData, loginEmployee);

/**
 * @route a route to register admin only.
 * @validateRegisterData regsitering data(name, email ...) validator middleware.
 * @registerAdmin register servive route end point.
 */
employeeRouter.post('/admin/register', validateRegisterData, registerEmployee);

/**
 * @route a route to get list of all ongoing projects.
 * @authUser user authentication middleware.
 * @getAllOngoingProjects a route end point to get all projects that are on ongoing state.
 */
 employeeRouter.get('/admin/home', authUser, isAdmin, getAllOngoingProjects);

/**
 * @route a route to register Employee only and is requested by admin only (employees can't register themselves).
 * @authUser user authentiating middleware (verfying token).
 * @isAdmin is the authenticated user an admin (checker).
 * @validateRegisterData regsitering data(name, email ...) validator middleware.
 * @registerEmployee register servive route end point.
 */
employeeRouter.post('/employee/register', authUser, isAdmin, validateRegisterData, registerEmployee);

/**
 * @route a route to get list of all ongoing projects that are related to the current employee.
 * @authUser user authentication middleware.
 * @getEmployeeOngoingProjects a route end point to get all projects that are on ongoing state.
 */
employeeRouter.get('/employee/home', authUser, getEmployeeOngoingProjects);


module.exports = employeeRouter;