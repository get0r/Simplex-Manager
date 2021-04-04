const Joi = require('joi');

const schemaOptions = {
    abortEarly: false,       //Don't stop validation until all the errors aren't discovered.
    stripUnknown: true,     //strip any unknown object or field.
};

//nameSchema only alphabets are permitted.
const nameSchema = Joi.string().regex(/^[A-za-z\s]+$/).required();
const usernameSchema = Joi.string().min(3).max(10).regex(/[A-za-z1-9\s]+/).required();
const passwordSchema = Joi.string().min(8).max(22).required();

//schema for login only
const loginSchema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

const employeeSchema = Joi.object({
    fname: nameSchema,
    lname: nameSchema,
    gender: Joi.string().max(1).regex(/^(M|F)$/),
    jobTitle: nameSchema,
    phone: Joi.string().max(10),
    salary: Joi.number(),
    email: Joi.string().email(),
    username: usernameSchema,
    password: passwordSchema,
});

module.exports = {
    loginSchema,
    employeeSchema,
    schemaOptions
};
