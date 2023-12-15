const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

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

bookingDetailSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("BookingDetail", bookingDetailSchema)