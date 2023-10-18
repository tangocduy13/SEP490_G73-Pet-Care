const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')

router.get('/', bookingController.getAllBooking)
    .get('/:userId', bookingController.getAllBookingByUserId)
    .post('/', bookingController.createBooking)
    .put('/:bookingId', bookingController.updateBooking)
    .put('/accept/:bookingId', bookingController.acceptBooking)
    .delete('/:bookingId', bookingController.deleteBooking)

module.exports = router    