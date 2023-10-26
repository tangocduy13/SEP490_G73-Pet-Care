const mongoose = require('mongoose')

const CartServiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

module.exports = mongoose.model('CartService', CartServiceSchema)