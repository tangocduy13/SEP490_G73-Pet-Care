const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

const getTotalOrderByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        // Kiểm tra xem startDate và endDate có tồn tại trong request query không
        if (!startDate || !endDate) {
            // Nếu không có dữ liệu đầu vào, sử dụng ngày mặc định
            const currentDate = new Date();
            startDate = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
            endDate = currentDate; // Ngày hiện tại
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }
        const totalOrders = await Order.countDocuments({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        res.status(200).json(totalOrders)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTotalRevenueByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        // Kiểm tra xem startDate và endDate có tồn tại trong request query không
        if (!startDate || !endDate) {
            // Nếu không có dữ liệu đầu vào, sử dụng ngày mặc định
            const currentDate = new Date();
            startDate = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
            endDate = currentDate; // Ngày hiện tại
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }
        const totalRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalPrice' },
                },
            },
        ]);
        res.status(200).json(totalRevenue)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTotalCustomerByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        // Kiểm tra xem startDate và endDate có tồn tại trong request query không
        if (!startDate || !endDate) {
            // Nếu không có dữ liệu đầu vào, sử dụng ngày mặc định
            const currentDate = new Date();
            startDate = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
            endDate = currentDate; // Ngày hiện tại
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }
        const totalCustomers = await Order.distinct('userId', {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        res.status(200).json(totalCustomers.length)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTotalProductsSoldByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        // Kiểm tra xem startDate và endDate có tồn tại trong request query không
        if (!startDate || !endDate) {
            // Nếu không có dữ liệu đầu vào, sử dụng ngày mặc định
            const currentDate = new Date();
            startDate = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
            endDate = currentDate; // Ngày hiện tại
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }
        const totalProductsSold = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: 'orders',
                    localField: 'orderId',
                    foreignField: '_id',
                    as: 'order',
                },
            },
            {
                $unwind: '$order',
            },
            {
                $match: {
                    'order.createdAt': { $gte: new Date(startDate), $lte: new Date(endDate) },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$quantity' },
                },
            },
        ]);

        res.status(200).json(totalProductsSold)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getRevenueStatistics = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const pipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`),
                    },
                    status: 'Đã giao hàng', // Chỉ lấy các đơn hàng đã hoàn thành (hoặc trạng thái tương ứng)
                },
            },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' } },
                    total: { $sum: '$totalPrice' },
                },
            },
        ];

        const result = await Order.aggregate(pipeline);

        // Tạo mảng kết quả chứa doanh thu cho từng tháng
        const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
            const monthData = result.find((item) => item._id.month === i + 1);
            return {
                month: i + 1,
                total: monthData ? monthData.total : 0,
            };
        });

        res.status(200).json({ revenueByMonth })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getTotalOrderByDate,
    getTotalRevenueByDate,
    getTotalCustomerByDate,
    getTotalProductsSoldByDate,
    getRevenueStatistics
}
