const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

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
        status: String,
    },
    {
        timestamps: true
    }

)

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Order", orderSchema)