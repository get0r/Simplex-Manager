const { logger } = require("../config/logger");
const { Client } = require("../models/client.model")

/**
 * a fake controller to register client to the database but
 * doesn't accept any req,res parameter
 *@returns the _id of the database record.
 */
const registerClient = async (clientDetail) => {

    try {
        //check if the company has already registered.
        const company = await Client.findOne({ cmpName: clientDetail.cmpName });

        if(company) return null;

        //register the client
        const client = new Client(clientDetail);
        await client.save();
        return client._id;
    } catch(e) {
        logger.error(`Unable to register clinet due to --- ${e.message}`);
    }
    return null;
};

module.exports = {
    registerClient
};