const { body, validationResult } = require('express-validator')

const validateCreateProduct = [
    body('productName').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên sản phẩm không chứa ký tự đặc biệt'),
    body('quantity').notEmpty().withMessage('Vui lòng nhập số lượng sản phẩm')
        .isInt({ min: 1 }).withMessage('Số lượng sản phẩm phải là một số lớn hơn 0'),
    body('price').notEmpty().withMessage('Vui lòng nhập giá tiền')
        .isInt({ min: 1 }).withMessage('Giá phải là một số lớn hơn 0'),
    body('description').trim().notEmpty().withMessage('Vui lòng nhập môt tả cho sản phẩm'),
    body('productImage').trim().notEmpty().withMessage('Vui lòng chọn ảnh cho sản phẩm'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại dịch vụ'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else return next();
    }
];

const validateUpdateProduct = [
    body('id').trim().notEmpty().withMessage('Không lấy được ID của sản phẩm'),
    body('productName').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên sản phẩm không chứa ký tự đặc biệt'),
    body('quantity').notEmpty().withMessage('Vui lòng nhập số lượng sản phẩm')
        .isInt({ min: 1 }).withMessage('Số lượng sản phẩm phải là một số lớn hơn 0'),
    body('price').notEmpty().withMessage('Vui lòng nhập giá tiền')
        .isInt({ min: 1 }).withMessage('Giá phải là một số lớn hơn 0'),
    body('description').trim().notEmpty().withMessage('Vui lòng nhập môt tả cho sản phẩm'),
    body('productImage').trim().notEmpty().withMessage('Vui lòng chọn ảnh cho sản phẩm'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại dịch vụ'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else return next();
    }
];

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
}