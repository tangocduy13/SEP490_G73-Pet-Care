const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    phone: String,
    address: String,
    gender: {
        type: Boolean,
        default: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    userImage: String
})

userSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', userSchema)