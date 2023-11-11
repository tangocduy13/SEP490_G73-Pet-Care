const Product = require("../models/Product");

const getAll = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const query = {};

        const options = {
            page: parseInt(page) || 1, // mặc định trang là 1
            limit: parseInt(limit) || 10,
        };

        const result = await Product.paginate(query, options);

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Product in the Database",
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { categoryId, quantity, price, description, productImage } = req.body;
        const productName = 'product'
        const product = await Product.create({
            categoryId,
            productName,
            quantity,
            price,
            description,
            productImage,
        });
        if (!product)
            return res.status(400).json({
                error: "Create product fail. Please try again",
            });
        res.status(201).json({
            message: "Create successfull",
            product: product,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id, categoryId, productName, quantity, price, description, productImage } = req.body;
        if (!productName)
            return res.status(400).json({
                error: "Product name is required",
            });

        const product = await Product.findById(id);
        product.categoryId = categoryId;
        product.productName = productName;
        product.quantity = quantity;
        product.price = price;
        product.description = description;
        product.productImage = productImage;
        await product.save();
        res.status(201).json({
            message: "Update successful",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        await product.deleteOne();
        res.status(201).json({
            message: `Deleted ${product.productName}`,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getAll,
    createProduct,
    updateProduct,
    deleteProduct,
};