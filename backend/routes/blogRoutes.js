const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer')
const upload = multer({ dest: 'public/image/blog/' })

router.post('/upload/:title', upload.single('image'), blogController.uploadBlogImage)
    .post('/create-blog', blogController.createBlog)
    .get('/', blogController.getAllBlog)

module.exports = router;