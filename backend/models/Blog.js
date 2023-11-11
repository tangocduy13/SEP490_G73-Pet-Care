const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        image: {
            data: Buffer,
            contentType: String,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Blog", blogSchema)