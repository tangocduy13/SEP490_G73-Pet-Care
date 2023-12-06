const { body, validationResult } = require('express-validator')

const validateCreateOrder = [
    body('userId').trim().notEmpty().withMessage("Không nhận được ID của user"),
    body('totalPrice').isInt({ min: 0 }).withMessage("Giá tiền phải là một số không âm"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
]

const validateUpdateOrder = [
    body('userId').trim().notEmpty().withMessage("Không nhận được ID của user"),
    body('totalPrice').isInt({ min: 0 }).withMessage("Giá tiền phải là một số không âm"),
    body('status').trim().notEmpty().withMessage("Trạng thái không được bỏ trống"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
]

module.exports = {
    validateCreateOrder,
    validateUpdateOrder
}