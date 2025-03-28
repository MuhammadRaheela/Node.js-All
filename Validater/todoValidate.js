const Joi = require("joi");

const titleValidate = Joi.object({

    title: Joi.string().required().messages({
        "string.base": "Todo must be a string",
        "string.empty": "Todo cannot be empty",
        "string.email": "Todo must be a valid email address",
        "any.required": `Todo is required`,
    }),
    
});

module.exports = titleValidate;
