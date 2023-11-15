const express = require('express')
const router = express.Router()
const cartProductController = require('../controllers/cartProductController')

router.get('/view-cart', cartProductController.viewCart)
.get('/checkout', cartProductController.checkout)
.post('/add-to-cart', cartProductController.addToCart)
   
module.exports = router   