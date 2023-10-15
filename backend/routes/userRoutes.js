const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')

router.get('/', usersController.getAll)
router.post('/', usersController.createUser)
router.patch('/', usersController.updateUser)

module.exports = router