const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/blog'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        const originalName = file.originalname;
        cb(null, `${originalName}`); // Keep the original file name
    },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), blogController.uploadBlogImage)
    .post('/create-blog', blogController.createBlog)
    .get('/', blogController.getAllBlog)
    .patch('/:id', blogController.updateOne)
    .delete('/:id', blogController.deleteOne)
    .get('/:id', blogController.getBlogById)
module.exports = router;