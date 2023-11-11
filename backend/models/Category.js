const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

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

CategorySchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Category', CategorySchema)