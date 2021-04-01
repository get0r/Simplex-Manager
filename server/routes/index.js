const express = require('express');

const employeeRouter = require('./employee.routes');
const projectRouter = require('./project.routes');


const router = express.Router();

//connecting user relates routes for logging and the like
router.use(employeeRouter);

//project CRUD routes
router.use(projectRouter);

module.exports = router;