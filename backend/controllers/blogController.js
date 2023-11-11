const Blog = require('../models/Blog');
const multer = require('multer');

// setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// route 'blog'
// POST 
const postBlog = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        // check if req contains an image file
        if (!req.file) {
            return res.json({ error: 'Image file is required' });
        }
        const newBlog = new Blog({
            title: title,
            content: content,
            userId: userId,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
        });

        // Save the new blog post
        const savedBlog = await newBlog.save();

        // response with the saved blog post
        res.status(201).json(savedBlog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    postBlog,
}