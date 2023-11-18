const { Schema, model } = require('mongoose');
const {handleMongooseError, preUpdate} = require('../utils/helpers/handleMongooseError');
const Joi = require("joi");

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, 
{ versionKey: false, timestamps: true })

contactSchema.post('save', handleMongooseError );
contactSchema.pre("findOneAndUpdate", preUpdate);
contactSchema.post('findOneAndUpdate', handleMongooseError );


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

const Contact = model('contact', contactSchema);

const schemas =  {
    createContactValidationSchema,
    updateContactValidationSchema,
    contactFavoriteSchema,
}

module.exports = { 
    Contact,
    schemas
};