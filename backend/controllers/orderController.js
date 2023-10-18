const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find()
        if (!orders){
            return res.status(404).json({
                error: "There are no Orders in the Database"
            })
        } 
        res.status(200).json(orders)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAllOrderByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId });
        if (!orders){
            return res.status(404).json({
                error: "UserId = :" + userId + " has no Orders in the Database"
            })
        }
        res.status(200).json(orders)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createOrder = async (req, res) => {
    try {
        const { userId, totalPrice, status } = req.body;
        const order = new Order({ userId, totalPrice, status });
        const result = await order.save();
        if (!result){
            return res.status(404).json({
                error: "Can not create Order"
            })
        } 
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { userId, totalPrice, status } = req.body;
        const order = await Order.findById(orderId);
        if (!order){
            return res.status(404).json({
                error: "Order: " + orderId + " not found!"
            })
        } 
        order.userId = userId;
        order.totalPrice = totalPrice;
        order.status = status;
        const result = await order.save();
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order){
            return res.status(404).json({
                error: "Order: " + orderId + " not found!"
            })
        } 
        const orderDetails = await OrderDetail.find({ orderId });
        if(orderDetails!= null){
            await OrderDetail.deleteMany({ orderId })
        }
        await Order.findByIdAndRemove(orderId);
        res.json({ message: 'Delete Order success!' });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getAllOrder,
    getAllOrderByUserId,
    createOrder,
    updateOrder,
    deleteOrder
}