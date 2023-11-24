const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/product');
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname;
        cb(null, `${originalname}`);
    },
});

const upload = multer({ storage: storage })

router.get('/', productController.getAll)
    .post('/', productController.createProduct)
    .patch('/', productController.updateProduct)
    .delete('/:id', productController.deleteProduct)
    .post('/upload', upload.single('image'), productController.uploadProductImage)
    .get('/:id', productController.getProductById)
module.exports = router