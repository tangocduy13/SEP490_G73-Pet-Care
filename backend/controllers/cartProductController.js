const CartProduct = require('../models/CartProduct');
const Product = require('../models/Product')
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const jwt = require('jsonwebtoken');

const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const cartItems = await CartProduct.find({ userId });
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
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const productId = req.params.productId;
       
        const product = await Product.findById(productId);

        if (!product) {
            return res.json({
                error: 'Product: ' + productId + ' not found.'
            });
        }

        let cartProduct = await CartProduct.findOne({ userId, productId});
        
        if (cartProduct) {
            cartProduct.quantity += 1;
        } else {
            cartProduct = new CartProduct({
                userId: userId,
                productId: productId,
                quantity: 1
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

const checkout = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const cartItems = await CartProduct.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new booking record
        let total = 0;
        const order = new Order({
            userId: userId,
            totalPrice: total, 
            status: false,
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
        res.status(500).json({err, message: 'Can not checkout'});
    }
}

module.exports = {
    addToCart,
    viewCart,
    checkout
}