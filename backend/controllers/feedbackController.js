const Feedback = require('../models/Feedback');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const getProductFeedback = async (req, res) => {
    try {
        const { productId, star, page, limit } = req.query;
        console.log(productId)
        const query = {};
        if (productId) {
            query.productId = productId
        }

        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            star: parseInt(star) || 5,
            populate: 'productId'
        }

        const result = await Feedback.paginate(query, options);
        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: 'No feedback was made yet',
            });
        }
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const feedbackProduct = async (req, res) => {
    try {
        // lấy user id
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const { productId, comment, star, image } = req.body;
        const result = await Feedback.create({ userId, productId, comment, star, image });
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    getProductFeedback,
    feedbackProduct
}

