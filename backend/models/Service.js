const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

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

serviceSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Service', serviceSchema)