const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/product', feedbackController.getProductFeedback)
        .post('/product', feedbackController.feedbackProduct)

module.exports = router;