const User = require('../models/User')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../utils/mailer')

// route 'login'
//method POST
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                error: 'Email and password can not be empty'
            })
        }
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
        // check email đã verify hay chưa
        else if (user.status === "verifying") {
            return res.json({
                error: 'Unverified'
            })
        } else {
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
        }
    } catch (err) {
        console.log(err)
    }
}

// route 'register'
// method POST
const register = async (req, res) => {
    try {
        const { fullname, email, password, role, phone, address, gender, userImage } = req.body


        // khi vừa đăng ký mặc định tài khoản là 'verifying'
        const status = 'verifying'
        const duplicate = await User.findOne({ email: email })
        if (duplicate) {
            res.json({
                error: "Email was taken"
            })
        }
        // check value valid
        else if (!fullname || !email || !password) {
            res.json({
                error: "fullname, email, password must be required",
            })
        }
        //check validate email
        else if (!emailValidator.validate(email)) {
            return res.json({
                error: "Wrong email format"
            })
        }
        // check duplicate email
        // 
        else {
            const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const hashPassword = await bcrypt.hash(password, 10)

            const user = await User.create({ fullname, email, "password": hashPassword, role, phone, address, gender, status, userImage, verifyCode })
            if (!user) {
                res.json({
                    error: "Internal server error"
                })
            }

            mailer.sendMail(user.email, "Verify Email", "Verify code: " + verifyCode.toString())
            res.status(201).json({
                message: "Register successful",
                User: user,
            })
        }
    } catch (err) {
        console.log(102, err)
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

const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            res.json("Email doesn't exist")
        }

        const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

        user.verifyCode = verifyCode
        user.save()

        mailer.sendMail(user.email, "Verify Email", "Verify code: " + verifyCode.toString())
        res.json({ message: "Check your email to get verify code" })
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}
// verify code sau khi đăng ký và reset mật khẩu
const verify = async (req, res) => {
    const { email, code } = req.body

    try {
        const user = await User.findOne({ email: email })

        if (!user) res.json("User Not Exists!")

        if (code === user.verifyCode) {
            // xóa verify code cũ sau khi verify thành công
            user.verifyCode = ''
            user.status = 'active'
            user.save()
            res.json({ message: "Ok" })
        }
        res.json({ error: "Fail" })
    } catch (error) {
        console.log(error)
        res.json({ error: "Fail" })
    }
}

const newPassword = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email })
        user.password = await bcrypt.hash(password, 10)
        const docs = user.save()
        if (docs)
            res.json({ message: "Change password successfull" })
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal server error" })
    }
}

module.exports = {
    login,
    register,
    changePassword,
    logout,
    getProfile,
    forgotPassword,
    newPassword,
    verify,
}