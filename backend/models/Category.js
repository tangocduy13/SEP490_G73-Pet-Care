const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    categoryName: { // vd category: service
        type: String,
        required: true,
    },
    feature: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Category', CategorySchema)