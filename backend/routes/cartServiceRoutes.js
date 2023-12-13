const express = require('express')
const router = express.Router()
const cartServiceController = require('../controllers/cartServiceController')

router.get('/view-cart', cartServiceController.viewCart)
.post('/checkout', cartServiceController.checkout)
.post('/add-to-cart', cartServiceController.addToCart)
.delete('/remove-from-cart/:serviceId', cartServiceController.removeFromCart)
   
module.exports = router   