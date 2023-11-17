const CartService = require('../models/CartService');
const Service = require('../models/Service')
const Booking = require('../models/Booking');
const BookingDetail = require('../models/BookingDetail');
const jwt = require('jsonwebtoken');


const viewCart = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const cartItems = await CartService.find({ userId }).populate('petId').populate('serviceId');
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

        const { serviceId, petId } = req.body;
       
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.json({
                error: 'Service: ' + serviceId + ' not found.'
            });
        }

        let cartService = await CartService.findOne({ userId, serviceId, petId });
        
        if (cartService) {
            cartService.quantity += 1;
        } else {
            cartService = new CartService({
                userId,
                petId,
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

const removeFromCart = async (req, res) => {
    // Lấy thông tin người dùng từ token JWT
    // const token = req.cookies.token;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const serviceId = req.params.serviceId;
    const service = await CartService.findOne({ serviceId });
    if (!service) {
        return res.status(404).json({ message: 'Service: ' + serviceId + ' not found.' });
    }
    try {
        // Xóa dịch vụ khỏi giỏ hàng của người dùng
        await CartService.findOneAndRemove({ userId, serviceId });
        res.status(200).json({ message: 'The service has been removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while removing the service from cart' });
    }
}

const checkout = async (req, res) => {
    try {
        // Lấy thông tin người dùng từ token JWT
        // const token = req.cookies.token;
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; 

        const cartItems = await CartService.find({ userId });

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new booking record
        let total = 0;
        const booking = new Booking({
            userId: userId,
            totalPrice: total, 
            status: 'Process',
        });
        const createdBooking = await booking.save();
        
        // Create booking details for each cart item
        for (const cartItem of cartItems) {

            const service = await Service.findById(cartItem.serviceId);

            if (service) {
                const bookingDetail = new BookingDetail({
                    bookingId: createdBooking._id,
                    petId: cartItem.petId,
                    serviceId: cartItem.serviceId,
                    quantity: cartItem.quantity,
                });

                await bookingDetail.save();

                // Update the total price
                total += service.price * cartItem.quantity;
            }
        }

        // Update the booking's total price
        createdBooking.totalPrice = total;
        await createdBooking.save();

        // Remove all cart items for the user
        await CartService.deleteMany({ userId });

        res.status(200).json({
            message: 'Checkout successful',
            booking: createdBooking,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({err, message: 'Can not checkout'});
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    viewCart,
    checkout
}