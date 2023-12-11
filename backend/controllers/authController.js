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
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({
                error: 'Email không tồn tại'
            })
        }
        // check email đã verify hay chưa
        else if (user.status === "verifying") {
            return res.json({
                error: 'Unverified'
            })
        } else {
            const matchPwd = await bcrypt.compare(password, user.password)
            if (!matchPwd)
                return res.status(400).json({
                    error: 'Sai mật khẩu'
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
            res.status(200).cookie('token', token).json({
                message: `Xin chào ${user.fullname}`,
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
            res.status(400).json({
                error: "Email đã được sử dụng"
            })
        } else {
            const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const hashPassword = await bcrypt.hash(password, 10)

            const user = await User.create({ fullname, email, "password": hashPassword, role, phone, address, gender, status, userImage, verifyCode })
            if (!user) {
                res.status(500).json({
                    error: "Internal server error"
                })
            } else {
                mailer.sendMail(user.email, "Verify Email", "Verify code: " + verifyCode.toString())
                res.status(201).json({
                    message: "Đăng ký thành công",
                    User: user,
                })
            }
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
        error: "Mật khẩu cũ không chính xác"
    })
    else if (!(newPassword === rePassword)) {
        res.json({
            error: "Vui lòng nhập lại chính xác mật khẩu mới"
        })
    } else {
        const hashPassword = await bcrypt.hash(newPassword, 10)
        await user.updateOne({ password: hashPassword })
        res.status(201).json({
            message: `User: ${user.fullname} change passwrod successfull`
        })
    }
}

const logout = (req, res) => {
    const token = req.cookies.token
    if (!token) return res.sendStatus(204) //No content
    else {
        res.clearCookie('token')
        res.json({ message: 'Cookie cleared' })
    }
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
            res.json("Email không tồn tại")
        } else {
            const verifyCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

            user.verifyCode = verifyCode
            user.save()

            mailer.sendMail(user.email, "Verify Email", "Verify code: " + verifyCode.toString())
            res.status(200).json({ message: "Check your email to get verify code" })
        }
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

        if (!user) {
            res.json("Email này không tồn tại")
        }

        else if (code === user.verifyCode) {
            // xóa verify code cũ sau khi verify thành công
            user.verifyCode = ''
            user.status = 'active'
            user.save()
            res.status(200).json({ message: "Xác thực thành công" })
        }
        else res.json({ error: "Sai mã xác thực. Vui lòng kiểm tra lại" })
    } catch (error) {
        console.log(error)
        res.json({ error: "Fail" })
    }
}

const newPassword = async (req, res) => {
    const { email, password } = req.body // trong trường hợp FE đã check new password === confirm new password
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