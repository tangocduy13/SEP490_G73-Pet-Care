const Product = require("../models/Product")

const getAll = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

const createProduct = async (req, res) => {
    try {
        const { productName, quantity, productImage } = req.body
        if (!productName) return res.status(400).json({
            error: "Product name is required"
        })
        const product = await Product.create({ productName, quantity, productImage })
        if (!product) return res.status(400).json({
            error: "Create product fail. Please try again"
        })
        res.status(201).json({
            message: "Create successfull",
            product: product
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id, productName, quantity, productImage } = req.body
        if (!productName) return res.status(400).json({
            error: "Product name is required"
        })
        console.log(productName)
        const product = await Product.findById(id)
        product.productName = productName
        product.quantity = quantity
        product.productImage = productImage
        await product.save()
        res.status(201).json({
            message: "Update successful"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body
        const product = await Product.findById(id)
        await product.deleteOne()
        res.status(201).json({
            message: `Deleted ${product.productName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getAll,
    createProduct,
    updateProduct,
    deleteProduct,
}