const { body, validationResult } = require("express-validator")

const validateCreateBooking = [
    body('userId').trim().notEmpty().withMessage("Không nhận được ID của Chủ"),
    body('petId').trim().notEmpty().withMessage("Không nhận được ID của Pet"),
    body('totalPrice').isInt({ min: 0 }).withMessage("Tiền phải là một số không âm"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next()
    }
];

const validateUpdateBooking = [
    body('userId').trim().notEmpty().withMessage("Không nhận được ID của Chủ"),
    body('petId').trim().notEmpty().withMessage("Không nhận được ID của Pet"),
    body('totalPrice').isInt({ min: 0 }).withMessage("Tiền phải là một số không âm"),
    body('status').trim().notEmpty().withMessage("Trạng thái lịch hẹn không được bỏ trống"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next()
    }
]

module.exports = {
    validateCreateBooking,
    validateUpdateBooking
}