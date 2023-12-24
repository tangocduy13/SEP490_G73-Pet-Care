const Booking = require('../models/Booking');
const BookingDetail = require('../models/BookingDetail');
const User = require('../models/User')

const getTotalBookingByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        // kiểm tra nếu ngày bắt đầu và ngày kết thúc không có thì lấy tất cả
        if (!startDate || !endDate) {
            const totalBookings = await Booking.find({status: 'Hoàn thành'});
            return res.status(200).json({ totalBookings });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        // lấy các booking có trạng thái "Hoàn thành" trong khoảng từ startDate đến endDate
        const totalBookings = await Booking.find({
            status: 'Hoàn thành',
            createdAt: { $gte: startDate, $lte: endDate },
        });

        res.status(200).json({ totalBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getTotalRevenueByDate = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;
        // Kiểm tra xem startDate và endDate có tồn tại trong request query không
        if (!startDate || !endDate) {
            const totalRevenue = await Booking.aggregate([
                {
                    $match: {
                        status: 'Hoàn thành',
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalPrice' },
                    },
                },
            ]);
            return res.status(200).json(totalRevenue)
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }
        const totalRevenue = await Booking.aggregate([
            {
                $match: {
                    status: 'Hoàn thành',
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

const getTotalCustomer = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            const userIds = await Booking.distinct('userId', {
                status: 'Hoàn thành',
            });
            const totalCustomers = userIds.length;
            return res.status(200).json({ totalCustomers, userIds });
        }

        startDate = new Date(startDate);
        endDate = new Date(endDate);

        const userIds = await Booking.distinct('userId', {
            status: 'Hoàn thành',
            createdAt: { $gte: startDate, $lte: endDate },
        });
        const totalCustomers = userIds.length;
        res.status(200).json({ totalCustomers, userIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// const getTotalServicesProvidedByDate = async (req, res) => {
//     try {
//         let { startDate, endDate } = req.query;
//         // Kiểm tra xem startDate và endDate có tồn tại trong request query không
//         if (!startDate || !endDate) {
//             // Nếu không có dữ liệu đầu vào, sử dụng ngày mặc định
//             const currentDate = new Date();
//             startDate = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
//             endDate = currentDate; // Ngày hiện tại
//         } else {
//             startDate = new Date(startDate);
//             endDate = new Date(endDate);
//         }
//         const totalProductsSold = await BookingDetail.aggregate([
//             {
//                 $lookup: {
//                     from: 'bookings',
//                     localField: 'bookingId',
//                     foreignField: '_id',
//                     as: 'booking',
//                 },
//             },
//             {
//                 $unwind: '$booking',
//             },
//             {
//                 $match: {
//                     'booking.status': 'Hoàn thành',
//                     'booking.createdAt': { $gte: new Date(startDate), $lte: new Date(endDate) },
//                 },
//             },
//             {
//                 $group: {
//                     _id: null,
//                     total: { $sum: '$quantity' },
//                 },
//             },
//         ]);

//         res.status(200).json(totalProductsSold)
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }

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
                    status: 'Hoàn thành', // Chỉ lấy các đơn hàng đã hoàn thành (hoặc trạng thái tương ứng)
                },
            },
            {
                $group: {
                    _id: { month: { $month: '$createdAt' } },
                    total: { $sum: '$totalPrice' },
                },
            },
        ];

        const result = await Booking.aggregate(pipeline);

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
    getTotalBookingByDate,
    getTotalRevenueByDate,
    getTotalCustomer,
    // getTotalProductsSoldByDate,
    getRevenueStatistics
}
