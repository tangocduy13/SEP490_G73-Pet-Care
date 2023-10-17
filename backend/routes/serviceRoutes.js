const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')

router.get('/', serviceController.getAll)
router.post('/', serviceController.createService)
router.patch('/', serviceController.updateService)

module.exports = router
