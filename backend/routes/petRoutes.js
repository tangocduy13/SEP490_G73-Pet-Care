const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')

router.get('/', petController.getAll)
    .post('/', petController.createPet)
    .patch('/', petController.updatePet)

module.exports = router