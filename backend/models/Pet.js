const mongoose = require('mongoose')

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

module.exports = mongoose.model("Pet", petSchema)