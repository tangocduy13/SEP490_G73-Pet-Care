const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const validateOrder = require('../middleware/validateOrderInput')

router.get('/', orderController.getAllOrder)
    .get('/:userId', orderController.getAllOrderByUserId)
    .post('/', validateOrder.validateCreateOrder, orderController.createOrder)
    .put('/:orderId', validateOrder.validateUpdateOrder, orderController.updateOrder)
    .put('/update-status/:orderId', orderController.updateStatus)
    .delete('/:orderId', orderController.deleteOrder)

module.exports = router    
