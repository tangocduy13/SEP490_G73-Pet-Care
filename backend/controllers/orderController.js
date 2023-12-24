const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

const getAll = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const { userId, status, startDate, endDate, sort, page, limit } = req.query;

        const query = {};

        if (userId) {
            query.userId = userId;
        }
        if (status) { // duy sửa lại lọc order = status
            query.status = status;
        } else query.status = "Chờ xác nhận"
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate), // Ngày bắt đầu
                $lte: new Date(endDate),   // Ngày kết thúc
            };
        }
        const options = {
            sort: { createdAt: -1 }, // Sắp xếp mặc định theo thời gian tạo giảm dần
            page: parseInt(page) || 1, // Trang mặc định là 1
            limit: parseInt(limit) || 10, // Giới hạn số lượng kết quả trên mỗi trang mặc định là 10
            populate: 'userId'
        };
        if (sort === 'asc') {
            options.sort = { totalPrice: 1 }; // Sắp xếp tăng dần theo totalPrice
        } else if (sort === 'desc') {
            options.sort = { totalPrice: -1 }; // Sắp xếp giảm dần theo totalPrice
        }

        const result = await Order.paginate(query, options);

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Orders in the Database",
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAllOrderByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.find({ userId }).populate('userId');
        if (!orders) {
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
        const { userId, totalPrice } = req.body;
        const order = new Order();
        order.userId = userId;
        order.totalPrice = totalPrice;
        order.status = 'Chờ xác nhận';
        const result = await order.save();
        if (!result) {
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
        if (!order) {
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
        if (!order) {
            return res.status(404).json({
                error: "Order: " + orderId + " not found!"
            })
        }
        const orderDetails = await OrderDetail.find({ orderId });
        if (orderDetails != null) {
            await OrderDetail.deleteMany({ orderId })
        }
        await Order.findByIdAndRemove(orderId);
        res.json({ message: 'Delete Order success!' });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { orderStatus } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                error: "Order: " + orderId + " not found!"
            })
        }
        order.status = orderStatus;
        const result = await order.save();
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAllOrderNoLimit = async (req, res) => {
    try {
        const { userId, status, startDate, endDate, sort, page, limit } = req.query;

        const query = {};

        if (userId) {
            query.userId = userId;
        }
        if (status) {
            query.status = status === 'true';
        }
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate), // Ngày bắt đầu
                $lte: new Date(endDate),   // Ngày kết thúc
            };
        }
        const options = {
            sort: { createdAt: -1 }, // Sắp xếp mặc định theo thời gian tạo giảm dần
            page: parseInt(page) || 1, // Trang mặc định là 1
            limit: parseInt(limit) || 10, // Giới hạn số lượng kết quả trên mỗi trang mặc định là 10
            populate: 'userId'
        };
        if (sort === 'asc') {
            options.sort = { totalPrice: 1 }; // Sắp xếp tăng dần theo totalPrice
        } else if (sort === 'desc') {
            options.sort = { totalPrice: -1 }; // Sắp xếp giảm dần theo totalPrice
        }

        const result = await Order.paginate(query, options);

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Orders in the Database",
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

module.exports = {
    getAll,
    getAllOrder,
    getAllOrderByUserId,
    createOrder,
    updateOrder,
    deleteOrder,
    updateStatus,
    getAllOrderNoLimit
}