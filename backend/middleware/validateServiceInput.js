const { body, validationResult } = require('express-validator');

const validateCreateService = [
    body('serviceName').trim().notEmpty().withMessage('Vui lòng nhập tên dịch vụ')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên dịch vụ không chứa ký tự đặc biệt'),

    body('status').isBoolean().withMessage('Vui lòng chọn đúng trạng thái của dịch vụ'),

    body('description').trim().notEmpty().withMessage('Vui lòng nhập mô tả cho dịch vụ'),

    body('price').notEmpty().withMessage('Vui lòng nhập giá')
        .isFloat({ min: 1 }).withMessage("Giá phải lớn hơn 0"),

    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại dịch vụ'),

    body('serviceImage').trim().notEmpty().withMessage('Vui lòng chọn ảnh cho dịch vụ'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        } else next();
    }
]

const validateUpdateService = [
    body('id').trim().notEmpty().withMessage('Không lấy được service ID'),

    body('serviceName').trim().notEmpty().withMessage('Vui lòng nhập tên dịch vụ')
        .matches(/^[\p{L}\s]+$/u).withMessage('Tên dịch vụ không chứa ký tự đặc biệt'),

    body('status').isBoolean().withMessage('Vui lòng chọn đúng trạng thái của dịch vụ'),

    body('description').trim().notEmpty().withMessage('Vui lòng nhập mô tả cho dịch vụ'),

    body('price').notEmpty().withMessage('Vui lòng nhập giá')
        .isFloat({ min: 1 }).withMessage("Giá phải lớn hơn 0"),

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
    body('discount').isFloat({ min: 0, max: 99 }).withMessage('Nhập một số trong khoảng từ 0 đến 99'),
    body('categoryId').trim().notEmpty().withMessage('Vui lòng chọn loại dịch vụ'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg })
        } else next();
    }
];

module.exports = {
    validateCreateService,
    validateUpdateService,
}