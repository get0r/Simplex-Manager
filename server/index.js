const app = require('./app');
const { logger } = require('./config/logger');


const PORT = 5437 || process.env.PORT;  //dynamic listening port

//start the server
const server = app.listen(PORT, () => {
    logger.info(`Server running on ${PORT}`);
});
