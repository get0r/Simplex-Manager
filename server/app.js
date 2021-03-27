const express = require('express');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

const connectToDatabase = require('./config/db');
const errorLogger = require('./middlewares/error/errorLogger');
const { httpLogger } = require('./config/logger');
const { NotFoundError } = require('./helpers/error');
const clientErrorHandler = require('./middlewares/error/clientErrorHandler');
const catchAllErrorHandler = require('./middlewares/error/catchAllErrorHandler');
const cookieParser = require('cookie-parser');


const app = express();

//apply middleware to change request format to JSON.
app.use(express.json());

//applying request sanitizing middleware for NoSQL injection
app.use(mongoSanitize());

//cookie setter to the body
app.use(cookieParser());

//connect to Database
connectToDatabase();

//use middleware to log HTTP activities - GET, POST request...
app.use(httpLogger);

//connecting all the routes
app.use('/api/v1', require('./routes'));

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