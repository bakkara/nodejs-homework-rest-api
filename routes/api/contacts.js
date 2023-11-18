const express = require('express');
const {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  upContact, 
} = require('../../controllers/contactsController');
const { schemas } = require('../../models/contacts');
const validateBody = require('../../utils/decorators/validateBody');
  
const isEmptyBody = require('../../utils/middlewares/isEmptyBody');
const { isValidId } = require('../../utils/middlewares/isValidId');



const router = express.Router()

router.get('/', getAllContacts)

router.get('/:contactId', isValidId, getOneContact)

router.post('/', isEmptyBody, validateBody(schemas.createContactValidationSchema), createContact)

router.delete('/:contactId', isValidId, deleteContact)

router.put('/:contactId', isValidId, isEmptyBody, validateBody(schemas.updateContactValidationSchema), upContact)

router.patch('/:contactId/favorite', isValidId, isEmptyBody, validateBody(schemas.contactFavoriteSchema), upContact);

module.exports = router
