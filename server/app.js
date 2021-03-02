const express = require('express');
const path = require('path');
const { json } = require('express');

const { httpLogger } = require('./config/logger');
const connectToDatabase = require('./config/db');
const { NotFoundError } = require('./helpers/error');

const app = express();

//apply middleware to change request format to JSON.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to Database
connectToDatabase();

//use middleware to log HTTP activities - GET, POST request...
app.use(httpLogger);


//send not found error to the client to an unknown route.
app.all('*', (req, res, next) => {
    next(
        new NotFoundError(path.basename(__filename),
            `${req.originalUrl} not found!`)
        );
  });

module.exports = app;