const mongoose = require('mongoose');

const { logger } = require('./logger');

const dbURI = `mongodb://localhost:27017` || process.env.DB_URI;

const connectToDatabase = () => {
    mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true });

    //handle connection events
    mongoose.connection.on('connecting', () => {
        logger.info(`Connecting to the database...`);
    });

    mongoose.connection.on('connected', () => {
        logger.info(`Successfully Connected to the database...`);
    });

    mongoose.connection.on('error', (error) => {
        logger.info(`Error while connecting to the database.\n Reason: ${error}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.info(`Disconnected from the database...`);
    });

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            logger.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
};

module.exports = connectToDatabase;