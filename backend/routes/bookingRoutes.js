const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const validateBooking = require('../middleware/validateBookingInput')

router.get('/', bookingController.getAllBooking)
    .get('/:userId', bookingController.getAllBookingByUserId)
    .post('/', validateBooking.validateCreateBooking, bookingController.createBooking)
    .put('/:bookingId', validateBooking.validateUpdateBooking, bookingController.updateBooking)
    .put('/update-status/:bookingId', bookingController.updateStatus)
    .delete('/:bookingId', bookingController.deleteBooking)

module.exports = router    