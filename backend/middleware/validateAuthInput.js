const { body, validationResult } = require("express-validator");

const validateLoginData = [
  // cho phép nhập mail edu, mail công ty
  // validate email
  body("email").trim().notEmpty().withMessage("Vui lòng nhập email"),

  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),

  // validate password
  body("password").trim().notEmpty().withMessage("Bạn chưa nhập mật khẩu"),

  // check for errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    } else next();
  },
];

const validateRegisterData = [
  // fullname can not be empty
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Tên không được bỏ trống")
    .matches(/^[\p{L} ]+$/u)
    .withMessage("Họ và tên không chính xác"),
  // email, password can not be empty
  body("email").trim().notEmpty().withMessage("Email không được bỏ trống"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Mật khẩu không được bỏ trống")
    .isLength({ min: 8 })
    .withMessage("Mật khẩu phải có độ dài từ 8 ký tự trở lên")
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage(
      "Mật khẩu phải chứa ít nhật 1 chữ hoa, 1 ký tự đặc biệt và 1 chữ số"
    ),
  // password confirm can not be empty
  body("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage("Vui lòng xác nhận mật khẩu"),
  // validate email format
  body("email").isEmail().normalizeEmail().withMessage("Email không hợp lệ"),
  // validate confirm password
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Mật khẩu nhập lại không khớp");
    }
    return true; // Return true if the passwords match
  }),
  // check for error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    } else next();
  },
];

module.exports = {
  validateLoginData,
  validateRegisterData,
};
