const express = require('express')
const router = express.Router()
const cartProductController = require('../controllers/cartProductController')

router.get('/view-cart', cartProductController.viewCart)
.get('/checkout', cartProductController.checkout)
.post('/add-to-cart', cartProductController.addToCart)
.delete('/remove-from-cart/:productId', cartProductController.removeFromCart)
   
module.exports = router   