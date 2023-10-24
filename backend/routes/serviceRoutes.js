const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')

router.get('/', serviceController.getAll)
    .post('/', serviceController.createService)
    .patch('/', serviceController.updateService)
    .delete('/', serviceController.deleteById)
    .get('/find', serviceController.findServiceByCateId)

module.exports = router
