const express = require('express');
const userSchemas = require('../../utils/validation/userValidationSchemas');
const validateBody = require('../../utils/decorators/validateBody');
const { signup, signin, current, logout } = require('../../controllers/usersController');
const authenticate = require('../../utils/middlewares/authenticate');

const router = express.Router()

router.post('/register', validateBody(userSchemas.registerSchema), signup)

router.post('/login', validateBody(userSchemas.loginSchema), signin)

router.get('/current', authenticate, current)

router.post('/logout', authenticate, logout)
 

module.exports = router

