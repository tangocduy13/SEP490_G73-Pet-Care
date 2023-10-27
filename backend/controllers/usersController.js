const User = require('../models/User')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

// route '/user'
// GET
const getAll = async (req, res) => {
    try {
        const { fullname, email, role, status, sort, page, limit } = req.query
        const query = {}

        if (fullname) {
            query.fullname = fullname
        }
        if (email) {
            query.email = email
        }
        if (role) {
            query.role = role
        }
        if (status) {
            query.status = status === 'true'
        }

        const options = {
            sort: { fullname: 1 }, // sắp xếp tên theo thứ tự bảng chữ cái alpha b
            page: parseInt(page) || 1, // Trang mặc định là 1
            limit: parseInt(limit) || 10, // Giới hạn số lượng kết quả trên mỗi trang mặc định là 5 để test phân trang
        }
        if (sort === 'asc') {
            options.sort = { email: 1 } // sắp xếp email theo bảng chứ cái
        }
        if (sort === 'desc') {
            options.sort = { email: -1 }
        }

        const result = await User.paginate(query, options)

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Users in the Database",
            });
        }
        res.status(200).json(result);
        // const users = await User.find()
        // if (!(await users).length) {
        //     return res.status(404).json({
        //         error: "User not found"
        //     })
        // }
        // res.status(200).json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

// route '/user'
// POST
const createUser = async (req, res) => {
    try {
        const { fullname, email, password, role, phone, address, gender, status, userImage } = req.body
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

        const user = await User.create({ fullname, email, "password": hashPassword, role, phone, address, gender, status, userImage })
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
        const { fullname, email, password, role, phone, address, gender, status, userImage } = req.body
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
        user.role = role
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
// route '/user/search'
// Get
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findById(id)
        if (!result) return res.json({
            error: "No user found"
        })
        res.status(200).json(result)
    } catch (error) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
// route '/user'
// DELETE
const deleteOne = async (req, res) => {
    const { id } = req.params
    try {
        await User.findByIdAndDelete(id)
        res.status(201).json({
            message: `Deleted user ${id}`
        })
    } catch (err) {
        console.log(err)
        res.status(400)
    }
}
module.exports = {
    getAll,
    createUser,
    updateUser,
    deleteOne,
    getUserById,
}