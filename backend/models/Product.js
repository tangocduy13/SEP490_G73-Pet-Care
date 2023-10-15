const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    productImage: String,
})

module.exports = mongoose.model('Product', productSchema)