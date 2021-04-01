const express = require('express');

const { registerAdmin } = require('../controllers/admin.controller');
const { loginEmployee } = require('../controllers/employee.controller');
const { validateLoginData, validateRegisterData } = require('../middlewares/validator/employee.validator');


const adminRouter = express.Router();

/**
 * @route a route for the login feature of Employees including admin,
 * @validateLoginData- login data(username, password) validation middleware.
 * @loginAdmin- login service route destination method.
 */
adminRouter.post('/login', validateLoginData, loginEmployee);

/**
 * @route a route to register admin only.
 * @validateRegisterData- regsitering data(name, email ...) validator middleware.
 * @registerAdmin- register servive route end point.
 */
adminRouter.post('/admin/register', validateRegisterData, registerAdmin);

module.exports = adminRouter;