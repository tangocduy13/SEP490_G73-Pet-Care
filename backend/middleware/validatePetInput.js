const { body, validationResult } = require('express-validator')
const validator = require('validator')

const validateCreatePet = [
    body('userId').trim().notEmpty().withMessage('Không nhận được ID người dùng'),
    body('petName').trim().notEmpty().withMessage('Vui lòng nhập tên thú cưng')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên sản phẩm không chứa ký tự đặc biệt'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại thú cưng'),
    body('height')
        .trim()
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (!validator.default.isNumeric(value)) {
                throw new Error("Chiều cao phải là một số")
            }
            if (parseFloat(value) <= 0) {
                throw new Error("Chiều cao phải lớn hơn 0")
            }

        }),
    body('weight')
        .trim()
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (!validator.default.isNumeric(value)) {
                throw new Error("Cân nặng phải là một số")
            }
            if (parseFloat(value) <= 0) {
                throw new Error("Cân nặng phải lớn hơn 0")
            }

        }),
    body('color').optional().isString().withMessage('Màu lông không hợp lệ'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
]

const validateUpdatePet = [
    body('id').trim().notEmpty().withMessage('Không nhận được ID của thú cưng'),
    body('userId').trim().notEmpty().withMessage('Không nhận được ID người dùng'),
    body('petName').trim().notEmpty().withMessage('Vui lòng nhập tên thú cưng')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên thú cưng không chứa ký tự đặc biệt'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại thú cưng'),
    body('height')
        .trim()
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (!validator.default.isNumeric(value)) {
                throw new Error("Chiều cao phải là một số")
            }
            if (parseFloat(value) <= 0) {
                throw new Error("Chiều cao phải lớn hơn 0")
            }

        }),
    body('weight')
        .trim()
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value === "") return true;
            if (!validator.default.isNumeric(value)) {
                throw new Error("Cân nặng phải là một số")
            }
            if (parseFloat(value) <= 0) {
                throw new Error("Cân nặng phải lớn hơn 0")
            }

        }),
    body('color').optional().isString().withMessage('Màu lông không hợp lệ'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
]

module.exports = {
    validateCreatePet,
    validateUpdatePet,
}