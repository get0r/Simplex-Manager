const express = require('express');

const adminRouter = require('./admin.routes');


const router = express.Router();

//connecting user relates routes for logging and the like
router.use(adminRouter);

module.exports = router;