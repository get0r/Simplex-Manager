const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    cmpName: {
        type: String,
        required: true
    },

    repName: {
        type: String,
        required: true,
    },

    address: {
        country: String,
        city: String,
        uniqueName: String,
    },

    cmpPhone: {
        type: String,
        required: true,
    },

    cmpEmail: {
        type: String,
        required: true,
    },

    repPhone: {
        type: String,
        required: true,
    },

    repEmail: {
        type: String,
        required: true,
    }

});

const Client = mongoose.model('Client', clientSchema);

module.exports = {
    Client
};
