const express = require('express');
const {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  upContact, 
  updateStatusContact} = require('../../controllers/contactsController');
  
const isEmptyBody = require('../../utils/middlewares/isEmptyBody');


const router = express.Router()

router.get('/', getAllContacts)

router.get('/:contactId', getOneContact)

router.post('/', isEmptyBody, createContact)

router.delete('/:contactId', deleteContact)

router.put('/:contactId', isEmptyBody, upContact)

router.patch('/:contactId/favorite', updateStatusContact);

module.exports = router
