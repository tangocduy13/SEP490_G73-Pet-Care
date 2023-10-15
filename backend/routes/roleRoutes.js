const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/rolesController')
const jwtVerify = require('../middleware/verifyJWT')

// router.use(jwtVerify)

router.get('/', rolesController.getAll)
router.post('/', rolesController.createRole)
router.patch('/', rolesController.updateRole)
router.delete('/', rolesController.deleteRole)

module.exports = router