const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.get('/', orderController.getAllOrder)
    .get('/:userId', orderController.getAllOrderByUserId)
    .post('/', orderController.createOrder)
    .put('/:orderId', orderController.updateOrder)
    .put('/update-status/:orderId', orderController.updateStatus)
    .delete('/:orderId', orderController.deleteOrder)

module.exports = router    
