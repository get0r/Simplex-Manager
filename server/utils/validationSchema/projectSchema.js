const Joi = require("joi");


//nameSchema only alphabets are permitted.
const nameSchema = Joi.string().regex(/^[A-za-z\s]+$/).required();
const usernameSchema = Joi.string().min(3).max(10).regex(/[A-za-z1-9\s]+/).required();

const projectSchema = Joi.object({
    name: nameSchema,
    deadline: Joi.date().required(),
    priority: Joi.number().max(100),
    clientId: Joi.string().max(50),
    assignedTo: Joi.array(),
    owner: usernameSchema,
    reportTo: usernameSchema,
    requestDesc: Joi.string(),
    detailId: Joi.string().max(50),
});

module.exports = {
    projectSchema
};