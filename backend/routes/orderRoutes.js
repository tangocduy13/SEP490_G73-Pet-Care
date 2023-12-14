const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const validateOrder = require('../middleware/validateOrderInput')

router.get('/', orderController.getAllOrder)
    .get('/all', orderController.getAll)
    .get('/get-all-order-by-uid/:userId', orderController.getAllOrderByUserId)
    .post('/', validateOrder.validateCreateOrder, orderController.createOrder)
    .put('/:orderId', validateOrder.validateUpdateOrder, orderController.updateOrder)
    .put('/update-status/:orderId', orderController.updateStatus)
    .delete('/:orderId', orderController.deleteOrder)
    .get('/noLimit', orderController.getAllOrderNoLimit)

module.exports = router    
