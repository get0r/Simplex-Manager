const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/admin.controller');
const { createProject } = require('../controllers/project.controller');
const { authUser } = require('../middlewares/auth/user.auth');
const { validateLoginData, validateRegisterData } = require('../middlewares/validator/user.validator');


const adminRouter = express.Router();

/**
 * @route a route for the login feature dedicated to the admin,
 * @validateLoginData- login data(username, password) validation middleware.
 * @loginAdmin- login service route destination method.
 */
adminRouter.post('/admin/login', validateLoginData, loginAdmin);

/**
 * @route a route to register admin only.
 * @validateRegisterData- regsitering data(name, email ...) validator middleware.
 * @registerAdmin- register servive route end point.
 */
adminRouter.post('/admin/register', validateRegisterData, registerAdmin);

/**
 * @route a route to create new project.
 * @authUser- a route to authorize user(verify token).
 * @createProject- project creator endpoint.
 */
adminRouter.get('/projects/new', authUser, createProject);

module.exports = adminRouter;