const express = require('express');
const {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  upContact, 
} = require('../../controllers/contactsController');
const schemas = require('../../utils/validation/contactValidationSchemas');
const validateBody = require('../../utils/decorators/validateBody');
  
const { isValidId } = require('../../utils/middlewares/isValidId');
const authenticate = require('../../utils/middlewares/authenticate');

const router = express.Router()

router.use(authenticate)

router
  .route('/')
  .get(getAllContacts)
  .post(validateBody(schemas.createContactValidationSchema), createContact);

router
  .route('/:contactId')
  .get(isValidId, getOneContact)
  .delete(isValidId, deleteContact)
  .put(isValidId, validateBody(schemas.updateContactValidationSchema), upContact)


router.patch('/:contactId/favorite', isValidId, validateBody(schemas.contactFavoriteSchema), upContact);

module.exports = router
