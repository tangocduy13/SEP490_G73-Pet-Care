const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    description: String,
    price: {
        type: Number,
        default: 1,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
    },
    serviceImage: String,
})

module.exports = mongoose.model('Service', serviceSchema)