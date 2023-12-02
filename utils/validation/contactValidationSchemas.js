const Joi = require("joi");

const createContactValidationSchema = Joi.object({
    "name": Joi.string().min(3).max(40).required().messages({
      'any.required': `Missing required name field`,
    }),
    "email": Joi.string().min(3).max(40).required().messages({
      'any.required': 'Missing required email field',
      
    }),
    "phone": Joi.string().min(3).max(40).required().messages({
      'any.required': `Missing required phone field`,
    }),
    "favorite": Joi.boolean(),
  });
  
  const updateContactValidationSchema = Joi.object({
    name: Joi.string().min(3).max(40),
    email: Joi.string().min(3).max(40),
    phone: Joi.string().min(3).max(40),
    favorite: Joi.boolean(),
  }).or("name", "email", "phone", "favorite");
  
  const contactFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
  });

  const schemas =  {
    createContactValidationSchema,
    updateContactValidationSchema,
    contactFavoriteSchema,
}

module.exports = schemas;