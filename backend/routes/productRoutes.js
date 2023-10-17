const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get('/', productController.getAll)
    .post('/', productController.createProduct)
    .patch('/', productController.updateProduct)
    .delete('/', productController.deleteProduct)

module.exports = router