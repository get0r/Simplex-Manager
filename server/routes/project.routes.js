const express = require('express');

const { createProject, removeProject } = require("../controllers/project.controller");
const { authUser, isAdmin } = require("../middlewares/auth/employee.auth");
const { validateProjectData } = require('../middlewares/validator/project.validator');

const projectRouter = express.Router();

/**
 * @route a route to create new project.
 * @authUser- a middleware to authorize user(verify token).
 * @validateProjectData a middleware to validate project data sent from the client.
 * @createProject- project creator endpoint.
 */
projectRouter.post('/projects/create', authUser, validateProjectData, createProject);

/**
 * @route a route to remove specific project.
 * @authUser  a middleware to authorize user(verify token).
 * @isAdmin   a middlware to check if the authorized user is an admin.
 * @removeProject project remover endpoint.
 */
projectRouter.put('/projects/remove/:id', authUser, removeProject);

/**
 * @route a route to update a specific attribute in a specific project.
 * @authUser  a middleware to authorize user(verify token).
 * @updateProjectDetail project updator endpoint.
 */
//projectRouter.put('/projects/updateDetail/:id', authUser, updateProjectDetail);


module.exports = projectRouter;

