const mongoose = require('mongoose')

const bookingDetailSchema = new mongoose.Schema(
    {
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
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
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("BookingDetail", bookingDetailSchema)