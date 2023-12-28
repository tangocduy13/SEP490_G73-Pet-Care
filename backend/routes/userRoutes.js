const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const validateProfile = require('../middleware/validateProfileInput')
const validateUser = require("../middleware/validateUserInput")

router.get('/', usersController.getAll)
    .post('/', validateUser.validateUserInput, usersController.createUser)
    .patch('/', validateProfile.validatePhoneNumberInput, usersController.updateUser) // update user dành cho admin
    .patch('/updateProfile', validateProfile.validatePhoneNumberInput, usersController.updateUser) // update profile
    .delete('/:id', usersController.deleteOne)
    .get('/:id', usersController.getUserById)

module.exports = router