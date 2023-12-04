const Contact = require("../models/contacts")

const getContactsService = async () => {
    return await Contact.find()
}

module.exports = {
    getContactsService
}