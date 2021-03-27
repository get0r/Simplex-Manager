const env = process.env.NODE_ENV; // 'development' or 'production'

const development = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3000,
        tokenSecret: process.env.TOKEN_SECRET || 'THisVV35463464hlkHLKHN,MBGSJHK987*(',
        secureCookie: false
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_NAME || 'simplexManagerDev'
    }
    };

const production = {
    app: {
        port: parseInt(process.env.PROD_APP_PORT) || 3000,
        tokenSecret: process.env.TOKEN_SECRET || 'THisVV35463464hlkHLKHN,MBGSJHK987*(',
        secureCookie: true
    },
    db: {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: parseInt(process.env.PROD_DB_PORT) || 27017,
        name: process.env.PROD_DB_NAME || 'simplexManagerProd'
    }
};

const config = {
    development,
    production
};

module.exports = config[env];

