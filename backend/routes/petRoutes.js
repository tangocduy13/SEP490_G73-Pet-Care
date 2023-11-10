const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')

router.get('/', petController.getAll)
    .post('/', petController.createPet)
    .patch('/', petController.updatePet)
    .get('/username', petController.getPetByUsername)
module.exports = router