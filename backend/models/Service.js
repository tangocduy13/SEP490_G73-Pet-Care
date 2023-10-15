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
    title: String,
    type: String,
    serviceImage: String,
})

module.exports = mongoose.model('Service', serviceSchema)