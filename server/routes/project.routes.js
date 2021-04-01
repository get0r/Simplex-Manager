const express = require('express');

const { createProject } = require("../controllers/project.controller");
const { authUser, isAdmin } = require("../middlewares/auth/employee.auth");

const projectRouter = express.Router();

/**
 * @route a route to create new project.
 * @authUser- a route to authorize user(verify token).
 * @createProject- project creator endpoint.
 */
projectRouter.get('/projects/new', authUser, isAdmin, createProject);


module.exports = projectRouter;

