const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const cors = require('cors')

router.post('/login', authController.login)
    .post('/register', authController.register)
    .put('/changePassword', authController.changePassword)
    .get('/profile', authController.getProfile)
    .post('/forgot-password', authController.forgotPassword)
    .get('/verify', authController.verify)
    .post('/reset-password', authController.resetPassword)
module.exports = router