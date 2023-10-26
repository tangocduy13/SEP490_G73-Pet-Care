const CartService = require('../models/CartService');
const Service = require('../models/Service')
const jwt = require('jsonwebtoken');


const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const cartItems = await CartService.find({ userId });
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
        const serviceId = req.params.serviceId;
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.json({
                error: 'Service: ' + serviceId + ' not found.'
            });
        }

        let cartService = await CartService.findOne({ userId, serviceId });
        
        if (cartService) {
            cartService.quantity += 1;
        } else {
            cartService = new CartService({
                userId,
                serviceId,
                quantity: 1
            });
        }
        const result = await cartService.save();
        res.json({
            message: 'Add service ' + serviceId + ' to cart success!',
            result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
}


module.exports = {
    addToCart,
    viewCart
}