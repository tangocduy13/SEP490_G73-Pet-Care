const express = require('express')
const router = express.Router()
const cartServiceController = require('../controllers/cartServiceController')

router.get('/view-cart', cartServiceController.viewCart)
.post('/add-to-cart/:serviceId', cartServiceController.addToCart)
   
module.exports = router   