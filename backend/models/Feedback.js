const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        comment: String,
        star: Number,
        image: String,
    },
    {
        timestamps: true,
    }
)

feedbackSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Feedback', feedbackSchema)