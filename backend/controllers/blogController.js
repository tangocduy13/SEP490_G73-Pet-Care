const Blog = require('../models/Blog');
const path = require('path')

const uploadBlogImage = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const imagePath = req.file.path; // Path where the file is saved by multer
        const originalFileName = req.file ? req.file.originalname : ''; // Get the original file name
        const imageUrl = `http://localhost:3500/image/blog/${originalFileName}`
        // tạm thời chỉ lấy được ảnh chưa lấy được dữ liệu title, content và userId (code mới học)
        const newBlog = new Blog({
            title,
            content,
            userId,
            image: imageUrl,
        });

        const savedBlog = await newBlog.save();
        res.status(201).json({
            docs: savedBlog,
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        const { title, page, limit, sort } = req.query

        const query = {}
        if (!title) {
            query.title = { $regex: new RegExp(title, 'i') }
        }
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            sort: { createdAt: -1 }, // mắc định sắp xếp theo thời gian gần đây nhất
            populate: 'userId',
        }
        if (sort === 'acs') {
            options.sort = 1
        }
        if (sort === 'desc') {
            options.sort = -1
        }
        const blogs = await Blog.paginate(query, options)
        if (!blogs) {
            res.status(204).json({ error: "There are no blog in database" })
        } else res.status(200).json(blogs)
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

        if (!blog) {
            res.json({ error: "Blog not found" })
        } else {
            blog.title = title
            blog.content = content
            blog.image = image
            const result = await blog.save()
            if (result) res.json({ message: "Updated Blog" })
        }
    } catch (error) {
        console.log(error)
        res.json({ error: "Internal Server Error" })
    }
}
const getBlogById = async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findOne({ _id: id }).populate('userId');
    if (!Blog) {
        res.status(404).json({ error: "Blog Not Found" })
    } else {
        res.status(200).json(blog)
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
    getBlogById,
}