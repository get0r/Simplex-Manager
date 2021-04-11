const express = require('express');

const { createProject } = require("../controllers/project.controller");
const { authUser } = require("../middlewares/auth/employee.auth");
const { validateProjectData } = require('../middlewares/validator/project.validator');

const projectRouter = express.Router();

/**
 * @route a route to create new project.
 * @authUser- a route to authorize user(verify token).
 * @createProject- project creator endpoint.
 */
projectRouter.post('/projects/create', authUser, validateProjectData, createProject);


module.exports = projectRouter;

