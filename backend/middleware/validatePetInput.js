const yup = require('yup')

// không custom validate cho height và weight là 1 sô thập phân đc => do non
const validateCreatePet = async (req, res, next) => {
    try {
        const data = req.body;
        let schema = yup.object().shape({
            userId: yup.string().trim().required('Không nhận được ID người dùng'),
            petName: yup.string().trim().required('Vui lòng nhập tên thú cưng')
                .matches(/^[\p{L}\s]+$/u, 'Tên thú cưng không chứa ký tự đặc biệt'),
            categoryId: yup.string().trim().required('Vui lòng chọn loại thú cưng'),
            height: yup.number().nullable().moreThan(0, 'Chiều cao phải lớn hơn 0'),
            weight: yup.number().nullable().moreThan(0, 'Cân nặng phải lớn hơn 0'),
        })
        await schema.validate(data);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors[0] })
    }
}

const validateUpdatePet = async (req, res, next) => {
    try {
        const data = req.body;
        let schema = yup.object().shape({
            id: yup.string().trim().required('Không nhận được ID của thú cưng'),
            userId: yup.string().trim().required('Không nhận được ID người dùng'),
            petName: yup.string().trim().required('Vui lòng nhập tên thú cưng')
                .matches(/^[\p{L}\s]+$/u, 'Tên thú cưng không chứa ký tự đặc biệt'),
            categoryId: yup.string().trim().required('Vui lòng chọn loại thú cưng'),
            height: yup.number().nullable().moreThan(0, 'Chiều cao phải lớn hơn 0'),
            weight: yup.number().nullable().moreThan(0, 'Cân nặng phải lớn hơn 0'),
        });
        await schema.validate(data);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors[0] })
        console.log(error);
    }
}

module.exports = {
    validateCreatePet,
    validateUpdatePet,
}