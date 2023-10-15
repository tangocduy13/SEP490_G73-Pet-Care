const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        totalPrice: {
            type: Number,
            default: 1,
        },
        status: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true
    }

)

module.exports = mongoose.model("Order", orderSchema)