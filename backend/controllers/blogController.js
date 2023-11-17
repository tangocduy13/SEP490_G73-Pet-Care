const Blog = require('../models/Blog');
const path = require('path')

const uploadBlogImage = (req, res) => {
    try {
        const imagePath = path.join('image/blog', req.params.title, req.file.filename)
        const imageUrl = `http//localhost:3500/${imagePath}`
        // Save the image path in the 'image' field of the Blog model
        console.log(imageUrl)
        const { title, content, userId } = req.body
        const newBlog = new Blog({
            title,
            content,
            userId,
            image: imagePath,
        })

        newBlog.save()

        res.json({ imageUrl })
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }
}

const createBlog = async (req, res) => {
    try {
        const { title, content, userId, imageUrl } = req.body;
        console.log(imageUrl)
        const newBlog = new Blog({
            title,
            content,
            userId,
            image: imageUrl, // Save the image path or URL here
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getAllBlog = async (req, res) => {
    try {
        const { title, page, limit } = req.query

        const query = {}
        if (!title) {
            query.title = { $regex: new RegExp(title, 'i') }
        }
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            populate: 'userId',
        }
        const blogs = await Blog.paginate(query, options)
        if (!blogs) {
            res.json({ error: "There are no blog in database" })
        }
        res.status(201).json(blogs)
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }
}

const updateOne = async (req, res) => {
    try {
        const { title, content, image } = req.body
        const { id } = req.params
        const blog = await Blog.findOne({ _id: id })

        if (!blog) res.json({ error: "Blog not found" })
        blog.title = title
        blog.content = content
        blog.image = image
        const result = await blog.save()
        if (result) res.json({ message: "Updated Blog" })
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }
}

const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Blog.deleteOne({ _id: id })
        if (result) res.json({ message: `Deleted one blog` })
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }
}

module.exports = {
    uploadBlogImage,
    createBlog,
    getAllBlog,
    deleteOne,
    updateOne,
}