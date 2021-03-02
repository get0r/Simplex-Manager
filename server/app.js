const express = require('express');
const path = require('path');
const { json } = require('express');

const connectToDatabase = require('./config/db');
const errorLogger = require('./middlewares/error/errorLogger');
const { httpLogger } = require('./config/logger');
const { NotFoundError } = require('./helpers/error');
const clientErrorHandler = require('./middlewares/error/clientErrorHandler');
const catchAllErrorHandler = require('./utils/catchAllErrorHandler');


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

//setting error logging handler.
app.use(errorLogger);

//setting client(response) error handler
app.use(clientErrorHandler);

//setting an error handler for unhandled errors
//by the clientErrorHandler
app.use(catchAllErrorHandler);
module.exports = app;