const mongoose = require('mongoose')

const bookingDetailSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },

    quantity: {
        type: Number,
        default: 1,
    }
})

module.exports = mongoose.model("BookingDetail", bookingDetailSchema)