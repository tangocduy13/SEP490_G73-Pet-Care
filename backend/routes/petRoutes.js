const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')

router.get('/', petController.getAll)
    .post('/', petController.createPet)
    .patch('/', petController.updatePet)
    .get('/username', petController.getPetByUsername)
    .get('/userid', petController.getPetByUserId)
module.exports = router