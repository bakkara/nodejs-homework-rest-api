const { Contact } = require("../models/contacts");
const ctrlWrapper = require("../utils/decorators/ctrlWrapper");
const { HttpError } = require('../utils/helpers/HttpErrors.js');


const getAllContacts = async (req, res) => {
        const contacts = await Contact.find();
        res.status(200).json(contacts)
};

const getOneContact = async (req, res) => {
        const { contactId } = req.params;  
        const contact = await Contact.findById(contactId);
        if (!contact) {
            throw HttpError(404, 'Not found');
        }
        res.status(200).json(contact);
};

const createContact = async (req, res) => {
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
};

const upContact = async (req, res) => {
        const { contactId } = req.params;
        const updateCont = await Contact.findByIdAndUpdate(contactId, req.body, {new: true, runValidators: true});;
        if (!updateCont) {
                throw HttpError(404, `No found`);
            }
        res.status(200).json(updateCont);
};

const deleteContact = async (req, res) => { 
        const { contactId } = req.params;  
        const contact = await Contact.findByIdAndDelete(contactId);
        if (!contact) {
            throw HttpError(404, `No found`);
        }
        
        res.json({ 
            message: "contact deleted"
        });
};


module.exports = {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    upContact: ctrlWrapper(upContact),
    deleteContact: ctrlWrapper(deleteContact),
};
