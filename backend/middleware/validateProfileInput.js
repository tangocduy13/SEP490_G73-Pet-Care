const { body, validationResult } = require("express-validator");
const User = require("../models/User")

// Dùng riêng cho update my profile
const validatePhoneNumberInput = [
    body('phone')
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (value !== null && !/^\d{10}$/.test(value)) {
                throw new Error("Số điện thoại bạn nhập không đúng")
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
