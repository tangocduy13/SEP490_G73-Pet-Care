const yup = require('yup')

const validateUserInput = async (req, res, next) => {
    try {
        const data = req.body;

        let schema = yup.object().shape({
            fullname: yup.string().trim().required("Vui lòng nhập tên người dùng")
                .matches(/^[^\p{S}]+$/u, "Tên không được chứa ký tự đặc biệt"),
            email: yup.string().trim().email("Email không hợp lệ").required('Vui lòng nhập địa chỉ email'),
            password: yup.string()
                .trim()
                .required('Vui lòng nhập mật khẩu')
                .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
                .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất một chữ hoa')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Mật khẩu phải có ít nhất một ký tự đặc biệt'),
            role: yup.string().trim().required("Role không được thiếu"),
            phone: yup.string()
                .trim()
                .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không đúng')
                .nullable(),
            address: yup.string().trim().optional(),
            gender: yup.boolean().required('Vui lòng chọn giới tính'),
            status: yup.string().trim().required("Chọn trạng thái"),
            userImage: yup.string().trim().optional(),
        })
        await schema.validate(data);
        next();
    } catch (error) {
        res.status(400).json({ error: error.errors[0] })
    }
}

module.exports = {
    validateUserInput
}