const express = require('express')
const router = express.Router()
const petController = require('../controllers/petController')
const multer = require('multer')
const validatePet = require('../middleware/validatePetInput')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/pet'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        cb(null, `${originalName}`); // Keep the original file name
    },
});

const upload = multer({ storage: storage });

router.get('/', petController.getAll)
    .post('/', validatePet.validateCreatePet, petController.createPet)
    .patch('/', validatePet.validateUpdatePet, petController.updatePet)
    .get('/username', petController.getPetByUsername)
    .get('/userid', petController.getPetByUserId)
    .put('/updateStatus', petController.updateStatus)
    .post('/upload', upload.single('image'), petController.uploadPetImage)
    .get('/booking', petController.getPetListForServiceBooking)
module.exports = router