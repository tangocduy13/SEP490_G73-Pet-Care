const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const cors = require('cors')

router.post('/login', authController.login)
    .post('/register', authController.register)
    .put('/changePassword', authController.changePassword)
    .get('/profile', authController.getProfile)

module.exports = router