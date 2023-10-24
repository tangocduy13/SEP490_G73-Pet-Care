const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.get('/', usersController.getAll)
    .post('/', usersController.createUser)
    .patch('/', usersController.updateUser)
    .delete('/', usersController.deleteOne)

module.exports = router