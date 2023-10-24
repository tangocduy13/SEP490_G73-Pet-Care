const OrderDetail = require('../models/OrderDetail');

const getOrderDetailByOrderId = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orderDetails = await OrderDetail.find({ orderId }).populate({
            path: 'productId',
            model: 'Product',
            select: 'productName quantity productImage'
          });
          if (!orderDetails) {
            return res.status(404).json({ 
                message: 'OrderDetail not found!' 
            });
          }
        res.status(200).json(orderDetails)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createOrderDetail = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const orderId = req.params.orderId;
        const newOrderDetail = new OrderDetail({ orderId, productId, quantity });
        const result = await newOrderDetail.save();
        if (!result){
            return res.status(404).json({
                error: "Can not create OrderDetail"
            })
        }
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getOrderDetailByOrderId,
    createOrderDetail
}
