const express = require('express')
const router = express.Router()
const orderDetailController = require('../controllers/orderDetailController')

router.get('/:orderId', orderDetailController.getOrderDetailByOrderId)
    .post('/:orderId', orderDetailController.createOrderDetail)


module.exports = router 