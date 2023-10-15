const mongoose = require('mongoose');

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
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
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

module.exports = mongoose.model('User', userSchema)