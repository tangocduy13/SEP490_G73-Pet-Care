const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    }
})

module.exports = mongoose.exports('Feedback', feedbackSchema)