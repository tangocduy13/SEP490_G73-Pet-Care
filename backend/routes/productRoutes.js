const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')

router.get('/', productController.getAll)
    .post('/', productController.createProduct)
    .patch('/', productController.updateProduct)
    .delete('/:id', productController.deleteProduct)

module.exports = router