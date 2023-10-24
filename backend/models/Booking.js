const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true,
        },
        totalPrice: {
            type: Number,
            default: 1,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

bookingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Booking', bookingSchema)