const { body, validationResult } = require("express-validator");
const User = require("../models/User")
// FE bỏ regex 
// Chỉ check khi người dùng nhập phone number (FE ko bt kết hợp cả allow null cả regex)
const validatePhoneNumberInput = [
    body('phone')
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (value !== null && !/^\d{10}$/.test(value)) {
                throw new Error("Số điện thoại bạn nhập không đúng")
            }
            // check duplidate phone number nếu ng dùng nhập
            const duplidatePhone = User.find({ phone: value })
            if (duplidatePhone) {
                throw new Error("Số điện thoại này đã được sử dụng! Xin vui lòng nhập số điện thoại khác")
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
];

module.exports = {
    validatePhoneNumberInput
}
