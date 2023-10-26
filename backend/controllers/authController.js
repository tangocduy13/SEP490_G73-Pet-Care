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
        const { email, password } = req.body

        if (!email || !password)
            return res.json({
                error: 'Email and password can not be empty'
            })
        if (!emailValidator.validate(email)) {
            return res.json({
                error: 'Wrong email format'
            })
        }
        const user = await User.findOne({ email: email })
        if (!user)
            return res.json({
                error: 'Email not found'
            })
        const matchPwd = await bcrypt.compare(password, user.password)
        if (!matchPwd)
            return res.json({
                error: 'Wrong password'
            })

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
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
// method POST
const register = async (req, res) => {
    try {
        const { fullname, email, password, role, phone, address, gender, status, userImage } = req.body
        // check value valid
        if (!fullname || !email || !password) {
            res.json({
                error: "fullname, email, password are required",
            })
        }
        //check validate email
        if (!emailValidator.validate(email)) {
            return res.json({
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

        const user = await User.create({ fullname, email, "password": hashPassword, role, phone, address, gender, status, userImage })
        if (!user) {
            res.json({
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

// route "/changePassword"
// method PUT
const changePassword = async (req, res) => {
    const { id, oldPassword, newPassword, rePassword } = req.body
    const user = await User.findById(id)
    const result = await bcrypt.compare(oldPassword, user.password)
    if (!result) return res.json({
        error: "Wrong old password"
    })
    if (!(newPassword === rePassword)) {
        res.json({
            error: "The New and Confirm passwords must match. Please re-type them."
        })
    }
    const hashPassword = await bcrypt.hash(newPassword, 10)
    await user.updateOne({ password: hashPassword })
    res.status(201).json({
        message: `User: ${user.fullname} change passwrod successfull`
    })
}

const logout = (req, res) => {
    const token = req.cookies.token
    if (!token) return res.sendStatus(204) //No content
    res.clearCookie('token')
    res.json({ message: 'Cookie cleared' })
}

const getProfile = async (req, res) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) throw err;
            res.json(user);
        })
    } else {
        res.json(null)
    }
}

module.exports = {
    login,
    register,
    changePassword,
    logout,
    getProfile
}