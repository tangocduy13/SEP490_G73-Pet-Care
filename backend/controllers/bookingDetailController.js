const BookingDetail = require('../models/BookingDetail');
const mongoose = require('mongoose')

const getBookingDetailByBookingId = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const bookingDetails = await BookingDetail.aggregate([
            {
                $match: { bookingId: new mongoose.Types.ObjectId(bookingId) }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: 'serviceId',
                    foreignField: '_id',
                    as: 'service'
                }
            },
            {
                $unwind: "$service"
            },
            {
                $lookup: {
                    from: 'pets',
                    localField: 'petId',
                    foreignField: '_id',
                    as: 'pet'
                }
            },
            {
                $unwind: "$pet"
            },
            {
                $addFields: {
                    isWithinSale: {
                        $and: [
                            { $gte: ["$createdAt", "$service.saleStartTime"] },
                            { $lte: ["$createdAt", "$service.saleEndTime"] }
                        ]
                    },
                    discountedPrice: {
                        $cond: {
                            if: {
                                $and: [
                                    "$service.saleStartTime",
                                    "$service.saleEndTime",
                                    { $gte: ["$createdAt", "$service.saleStartTime"] },
                                    { $lte: ["$createdAt", "$service.saleEndTime"] }
                                ]
                            },
                            then: {
                                $multiply: [
                                    "$quantity",
                                    { $subtract: ["$service.price", { $multiply: ["$service.price", { $divide: ["$service.discount", 100] }] }] }
                                ]
                            },
                            else: { $multiply: ["$quantity", "$service.price"] }
                        }
                    }
                }
            },
            {
                $project: {
                    bookingId: 1,
                    petId: 1,
                    serviceId: 1,
                    quantity: 1,
                    price: "$discountedPrice",
                    service: 1,
                    pet: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!bookingDetails || bookingDetails.length === 0) {
            return res.status(404).json({ message: 'BookingDetail not found!' });
        }

        res.status(200).json(bookingDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const createBookingDetail = async (req, res) => {
    try {
        const { serviceId, quantity } = req.body;
        const bookingId = req.params.bookingId;
        const newBookingDetail = new BookingDetail({ bookingId, serviceId, quantity });
        const result = await newBookingDetail.save();
        if (!result) {
            return res.status(404).json({
                error: "Can not create BookingDetail"
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
        const result = await BookingDetail.findByIdAndDelete(id)
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
    getBookingDetailByBookingId,
    createBookingDetail,
    deleteOrderDetail
}
