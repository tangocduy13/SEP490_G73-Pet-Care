const CartProduct = require('../models/CartProduct');
const Product = require('../models/Product')
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const jwt = require('jsonwebtoken');

const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;
        
        const cartItems = await CartProduct.find({ userId }).populate('productId');
        res.status(200).json(cartItems);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const addToCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const productId = req.body.productId;
        const quantity = req.body.quantity;

        const product = await Product.findById(productId);

        if (!product) {
            return res.json({
                error: 'Product: ' + productId + ' not found.'
            });
        }

        let cartProduct = await CartProduct.findOne({ userId, productId });

        if (cartProduct) {
            cartProduct.quantity += quantity;
        } else {
            cartProduct = new CartProduct({
                userId: userId,
                productId: productId,
                quantity: quantity
            });
        }
        const result = await cartProduct.save();
        res.json({
            message: 'Add product ' + productId + ' to cart success!',
            result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}

const removeFromCart = async (req, res) => {
    // Lấy thông tin người dùng từ token JWT
    // const token = req.cookies.token;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const productId = req.params.productId;
    const product = await CartProduct.findOne({ productId });
    if (!product) {
        return res.status(404).json({ message: 'Product: ' + productId + ' not found.' });
    }
    try {
        // Xóa sản phẩm khỏi giỏ hàng của người dùng
        await CartProduct.findOneAndRemove({ userId, productId });
        res.status(200).json({ message: 'The product has been removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while removing the product from cart' });
    }
}

const checkout = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        const cartItems = await CartProduct.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new order record
        let total = 0;
        const order = new Order({
            userId: userId,
            totalPrice: total,
            status: 'Chờ xác nhận',
            recipientName: req.body.recipientName,
            recipientPhoneNumber: req.body.recipientPhoneNumber,
            deliveryAddress: req.body.deliveryAddress,
        });
        const createdOrder = await order.save();

        // Create booking details for each cart item
        for (const cartItem of cartItems) {

            const product = await Product.findById(cartItem.productId);

            if (product) {
                const orderDetail = new OrderDetail({
                    orderId: createdOrder._id,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                });

                await orderDetail.save();

                // Update the total price
                total += product.price * cartItem.quantity;
            }
            product.quantity -= cartItem.quantity;
            await product.save();
        }

        // Update the booking's total price
        createdOrder.totalPrice = total;
        await createdOrder.save();

        // Remove all cart items for the user
        await CartProduct.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            order: createdOrder,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err, message: 'Can not checkout' });
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    viewCart,
    checkout
}