const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/admin.controller');
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

module.exports = adminRouter;