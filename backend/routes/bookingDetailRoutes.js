const express = require('express')
const router = express.Router()
const bookingDetailController = require('../controllers/bookingDetailController')

router.get('/:bookingId', bookingDetailController.getBookingDetailByBookingId)
    .post('/:bookingId', bookingDetailController.createBookingDetail)


module.exports = router 