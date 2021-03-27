const Joi = require('joi');

const schemaOptions = {
    abortEarly: false,       //Don't stop validation until all the errors aren't discovered.
    stripUnknown: true,     //strip any unknown object or field.
};

//nameSchema only alphabets are permitted.
const nameSchema = Joi.string().regex(/^[A-za-z\s]+$/).required();

//schema for login only
const loginSchema = Joi.object({
    username: Joi.string().min(3).max(10).regex(/^[A-za-z\s]+$/).required(),
    password: Joi.string().min(8).max(22).required(),
});

const adminSchema = Joi.object({
    fname: nameSchema,
    lname: nameSchema,
    username: nameSchema.min(3).max(10),
    password: Joi.string().min(8).max(22).required(),
});

module.exports = {
    loginSchema,
    adminSchema,
    schemaOptions
};
