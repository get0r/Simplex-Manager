const mongoose = require('mongoose');

//schema for the admin user (the manager user)
const employeeSchema = new mongoose.Schema({
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

    gender: {
        type: String,
        required: true,
        trim: true,
    },

    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },

    phone: {
        type: String,
        required: true,
        maxlength: 10,
        trim: true,
    },

    salary: {
        type: Number,
        required: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
    },

    photoURL: {
        type: String,
        default: "",
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
    },

    isAdmin: {
        type: Boolean,
        default: false,
        trim: true,
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;