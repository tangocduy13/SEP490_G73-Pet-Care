const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    price: {
        type: Number,
        default: 1,
    },
    productImage: String,
})

productSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', productSchema)