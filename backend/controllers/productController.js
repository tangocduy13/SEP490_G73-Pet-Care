const Product = require("../models/Product");

const getAll = async (req, res) => {
    try {
        const { page, limit, product, categoryId } = req.query;
        const query = {}
        if (categoryId) {
            query.categoryId = categoryId || ''
        }
        // tìm kiếm tên product theo tên
        if (product) {
            query.productName = { $regex: new RegExp(product, 'i') }
        }
        const options = {
            page: parseInt(page) || 1, // mặc định trang là 1
            limit: parseInt(limit) || 10,
        };

        const result = await Product.paginate(query, options);

        if (!result.docs || result.docs.length === 0) {
            return res.json({
                error: "There are no Product in the Database",
            });
        }

        // Map each document to include the discountedPrice
        const productsWithDiscountedPrice = result.docs.map(product => {
            return {
                ...product.toObject(),
                discountedPrice: product.discountedPrice // Include discountedPrice in each product
            };
        });

        // Include products with discountedPrice in the response
        const response = {
            ...result,
            docs: productsWithDiscountedPrice
        };
        res.status(200).json(response);

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
        const { categoryId, productName, quantity, price, description, productImage } = req.body;

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
        const { id, categoryId, productName, quantity, price, discount, saleStartTime, saleEndTime, description, productImage } = req.body;
        if (!productName)
            return res.status(400).json({
                error: "Product name is required",
            });

        const product = await Product.findById(id);
        product.categoryId = categoryId;
        product.productName = productName;
        product.quantity = quantity;
        product.price = price;
        product.discount = discount
        product.saleStartTime = saleStartTime
        product.saleEndTime = saleEndTime
        product.description = description;
        product.productImage = productImage;

        const updateProduct = await product.save()
        const productWithDiscountedPrice = updateProduct.toObject({ virtuals: true });

        res.status(201).json({
            message: "Update successful",
            product: productWithDiscountedPrice,
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