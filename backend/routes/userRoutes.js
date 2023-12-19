const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const validateProfile = require('../middleware/validateProfileInput')

router.get('/', usersController.getAll)
    .post('/', usersController.createUser)
    .patch('/', validateProfile.validatePhoneNumberInput, usersController.updateUser)
    .delete('/:id', usersController.deleteOne)
    .get('/:id', usersController.getUserById)

module.exports = router