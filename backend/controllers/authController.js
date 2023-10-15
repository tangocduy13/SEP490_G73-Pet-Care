const User = require('../models/User')
const Role = require('../models/Role')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../utils/mailer')

// route 'login'
//method POST
const login = async (req, res) => {
    try {
        const { email, password } = await req.body

        if (!email || !password)
            return res.status(400).json({
                error: 'Email and password can not be empty'
            })
        if (!emailValidator.validate(email)) {
            return res.status(400).json({
                error: 'Wrong email format'
            })
        }
        const user = await User.findOne({ email: email })
        if (!user)
            return res.status(404).json({
                error: 'Email not found'
            })
        const matchPwd = await bcrypt.compare(password, user.password)
        if (!matchPwd)
            return res.status(404).json({
                error: 'Wrong password'
            })
        const roleName = await Role.findById(user.roleId).roleName
        const token = jwt.sign(
            {
                email: user.email,
                role: roleName,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '24h'
            }
        )
        res.cookie('token', token).json({
            message: "Login successful",
            token: token
        })
    } catch (err) {
        console.log(err)
    }
}

// route 'register'
//method POST
const register = async (req, res) => {
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
        const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        mailer.sendMail(user.email, "Verify Email", "Verify code: " + verifyCode.toString())
        res.status(201).json({
            message: "Register successful",
            User: user,
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    login,
    register,
}