const express = require('express');
const userSchemas = require('../../utils/validation/userValidationSchemas');
const validateBody = require('../../utils/decorators/validateBody');
const { signup, signin, current, logout, updateAvatar } = require('../../controllers/usersController');
const authenticate = require('../../utils/middlewares/authenticate');
const upload = require('../../utils/middlewares/upload');
const router = express.Router()

router.post('/register', upload.single("avatar"), validateBody(userSchemas.registerSchema), signup)

router.post('/login', validateBody(userSchemas.loginSchema), signin)

router.get('/current', authenticate, current)

router.post('/logout', authenticate, logout)
 
router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router

