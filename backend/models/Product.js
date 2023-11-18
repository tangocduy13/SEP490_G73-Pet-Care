const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
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
    discount: {
        type: Number,
        default: 0,
    },
    saleStartTime: Date,
    saleEndTime: Date,
    description: String,
    productImage: String,
})

productSchema.virtual('discountedPrice').get(function () {
    const currentTime = new Date();
    if (this.saleStartTime && this.saleEndTime && currentTime >= this.saleStartTime && currentTime <= this.saleEndTime) {
        return this.price - (this.price * (this.discount / 100));
    }
    return this.price;
});

productSchema.pre('save', function (next) {
    const currentTime = new Date();
    if (this.saleEndTime && currentTime > this.saleEndTime) {
        this.discount = 0; // Reset discount to 0 when sale ends
    }
    next();
});


productSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Product', productSchema)