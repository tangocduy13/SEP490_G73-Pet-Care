const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')

router.get('/', categoryController.getAll)
    .post('/', categoryController.createCategory)
    .patch('/', categoryController.updateCategory)
    .delete('/:id', categoryController.deleteOne)
    .get('/catename/:name', categoryController.getCategoryByName)
module.exports = router