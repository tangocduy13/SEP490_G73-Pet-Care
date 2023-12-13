const { body, validationResult } = require('express-validator')

const validateCreateProduct = [
    body('productName').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm')
        .matches(/^[\p{L}0-9\s&\-]+$/u).withMessage('Tên sản phẩm không chứa ký tự đặc biệt'),
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
        } else next();
    }
];

const validateUpdateProduct = [
    body('id').trim().notEmpty().withMessage('Không lấy được ID của sản phẩm'),
    body('productName').trim().notEmpty().withMessage('Vui lòng nhập tên sản phẩm')
        .matches(/^[\p{L}0-9\s&\-]+$/u).withMessage('Tên sản phẩm không chứa ký tự đặc biệt'),
    body('quantity').notEmpty().withMessage('Vui lòng nhập số lượng sản phẩm')
        .isInt({ min: 1 }).withMessage('Số lượng sản phẩm phải là một số lớn hơn 0'),
    body('price').notEmpty().withMessage('Vui lòng nhập giá tiền')
        .isInt({ min: 1 }).withMessage('Giá phải là một số lớn hơn 0'),
    body('saleStartTime').optional({ nullable: true })
        .isISO8601().withMessage('Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD'),
    body('saleEndTime').optional({ nullable: true })
        .isISO8601().withMessage('Vui lòng nhập ngày tháng theo định dạng YYYY-MM-DD')
        .custom((value, { req }) => {
            const saleStartTime = new Date(req.body.saleStartTime)
            const saleEndTime = new Date(req.body.saleEndTime)
            if (saleStartTime >= saleEndTime) {
                throw new Error('Thời gian sale kết thúc phải sau thời gian sale bắt đầu')
            } else return true;
        }),
    body('discount').isFloat({ min: 0, max: 100 }).withMessage('Nhập một số trong khoảng từ 0 đến 100'),
    body('description').trim().notEmpty().withMessage('Vui lòng nhập môt tả cho sản phẩm'),
    body('productImage').trim().notEmpty().withMessage('Vui lòng chọn ảnh cho sản phẩm'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại dịch vụ'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
];

module.exports = {
    validateCreateProduct,
    validateUpdateProduct,
}