const User = require('../models/User')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

// route '/user'
// GET
const getAll = async (req, res) => {
    try {
        const users = await User.find()
        if (!(await users).length) {
            return res.status(404).json({
                error: "User not found"
            })
        }
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

// route '/user'
// POST
const createUser = async (req, res) => {
    try {
        const { fullname, email, password, roleId, phone, address, gender, status, userImage } = req.body
        // check value valid
        if (!fullname || !email || !password) {
            res.status(500).json({
                error: "fullname, email, password are required",
            })
        }
        //check validate email
        if (!emailValidator.validate(email)) {
            return res.status(500).json({
                error: "Wrong email format"
            })
        }
        // check duplicate email
        const duplicate = await User.findOne({ email: email })
        if (duplicate) {
            res.json({
                error: "Email was taken"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({ fullname, email, "password": hashPassword, roleId, phone, address, gender, status, userImage })
        if (!user) {
            res.status(500).json({
                error: "Server error! Please try again"
            })
        }

        res.status(201).json({
            message: "Create successful",
            User: user,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

// route '/user'
// PATCH
const updateUser = async (req, res) => {
    try {
        const { fullname, email, password, roleId, phone, address, gender, status, userImage } = req.body
        // check value valid
        if (!fullname || !password) {
            res.status(500).json({
                error: "fullname, password are required",
            })
        }
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(404).json({
                error: "User not found"
            })
        }
        user.fullname = fullname
        user.password = password
        user.roleId = roleId
        user.phone = phone
        user.address = address
        user.gender = gender
        user.status = status
        user.userImage = userImage
        // update user
        const result = await user.save()
        if (result) {
            res.status(201).json({
                message: `Updated ${user.fullname}`
            })
        } else {
            res.status(400).json({
                error: "Update fail"
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    getAll,
    createUser,
    updateUser,
}