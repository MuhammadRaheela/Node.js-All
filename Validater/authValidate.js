const Joi = require("joi");

const userValidate = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 3 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().required().email().messages({
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be a valid email address",
        "any.required": `Email is required`,
    }),
    password: Joi.string().required().min(5).max(10).messages({
        "string.base": "Enter password",
        "string.empty": "Enter password",
        "string.min": "Password must be greater then {#limit}",
        "string.min": "Password must be less then {#limit}",
        "any.required": "Password is required",
    }),
});

module.exports = userValidate;
