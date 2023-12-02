const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const validateAuth = require('../middleware/validateAuthInput')

router.post('/login', validateAuth.validateLoginData, authController.login)
    .post('/register', validateAuth.validateRegisterData, authController.register)
    .put('/changePassword', authController.changePassword)
    .get('/profile', authController.getProfile)
    .post('/forgot-password', authController.forgotPassword)
    .post('/verify', authController.verify)
    .post('/new-password', authController.newPassword)

module.exports = router