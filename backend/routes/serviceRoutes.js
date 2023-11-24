const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/service');
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        cb(null, `${originalName}`); // keep the original file name
    }
})

const upload = multer({ storage: storage })

router.get('/', serviceController.getAll)
    .post('/', serviceController.createService)
    .patch('/', serviceController.updateService)
    .delete('/:id', serviceController.deleteById)
    .post('/upload', upload.single('image'), serviceController.uploadServiceImage)
    .get('/:id', serviceController.getServiceById)

module.exports = router
