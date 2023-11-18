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
    discount: {
        type: Number,
        default: 0,
    },
    saleStartTime: Date,
    saleEndTime: Date,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true,
    },
    serviceImage: String,
})

serviceSchema.virtual('discountedPrice').get(function () {
    const currentTime = new Date();
    if (this.saleStartTime && this.saleEndTime && currentTime >= this.saleStartTime && currentTime <= this.saleEndTime) {
        return this.price - (this.price * (this.discount / 100));
    }
    return this.price;
});

serviceSchema.pre('save', function (next) {
    const currentTime = new Date();
    if (this.saleEndTime && currentTime > this.saleEndTime) {
        this.discount = 0; // Reset discount to 0 when sale ends
    }
    next();
});

serviceSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Service', serviceSchema)