const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAll)
    .post('/', categoryController.createCategory)
    .patch('/', categoryController.updateCategory)
    .delete('/', categoryController.deleteOne)

module.exports = router