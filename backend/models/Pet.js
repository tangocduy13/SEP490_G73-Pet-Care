const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const petSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petName: String,
    rank: {
        type: Number,
        default: 1,
    },
    status: {
        type: Boolean,
        default: true,
    },
    category: String,
    petImage: String,
})

petSchema.plugin(mongoosePaginate)
module.exports = mongoose.model("Pet", petSchema)