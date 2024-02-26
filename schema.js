const Joi = require('joi');

const bankingSchema = Joi.object({
    Username:Joi.string(),
    Ammount:Joi.number().min(1).required()
}).required()

module.exports=bankingSchema