const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate');

const blogSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        image: String
    },
    {
        timestamps: true
    }
)

blogSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Blog", blogSchema)