const OrderDetail = require('../models/OrderDetail');

const getOrderDetailByOrderId = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const orderDetails = await OrderDetail.find({ orderId }).populate('productId');
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
        if (!result) {
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

const deleteOrderDetail = async (req, res) => {
    try {
        const { id } = req.params
        const result = await OrderDetail.findByIdAndDelete(id)
        if (!result) {
            res.status(400).json({ error: "Gặp lỗi không xóa được" });
        } else {
            res.status(201).json({ message: "Xóa sản phẩm thành công" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log(error)
    }
}

module.exports = {
    getOrderDetailByOrderId,
    createOrderDetail,
    deleteOrderDetail
}
