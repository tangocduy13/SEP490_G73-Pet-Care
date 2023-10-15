const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // dich nguoc token chua thong tim cua mot user
        req.userData = decoded; // lưu thông tin vừa decode vào trong object req.userData
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};