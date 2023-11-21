const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/blog'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname; // Remove spaces from the original name
        cb(null, `${originalName}`); // Keep the original file name
    },
});

const upload = multer({ storage: storage });

router.post('/upload/:userId', upload.single('image'), blogController.uploadBlogImage)
    .post('/create-blog', blogController.createBlog)
    .get('/', blogController.getAllBlog)
    .patch('/:id', blogController.updateOne)
    .delete('/:id', blogController.deleteOne)

module.exports = router;