const mongoose = require('mongoose');

//schema for the admin user (the manager user)
const adminSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },

    lname: {
        type: String,
        required: true,
        trim: true,
    },

    username: {
        type: String,
        required: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        trim: true,
    }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;