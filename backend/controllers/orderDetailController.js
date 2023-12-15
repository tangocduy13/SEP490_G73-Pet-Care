const OrderDetail = require('../models/OrderDetail');
const mongoose = require('mongoose')

const getOrderDetailByOrderId = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const orderDetails = await OrderDetail.aggregate([
            {
                $match: { orderId: new mongoose.Types.ObjectId(orderId) }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: "$product"
            },
            {
                $addFields: {
                    isWithinSale: {
                        $and: [
                            { $gte: ["$product.saleStartTime", "$createdAt"] },
                            { $lte: ["$product.saleEndTime", "$createdAt"] }
                        ]
                    },
                    discountedPrice: {
                        $cond: {
                            if: {
                                $and: [
                                    "$product.saleStartTime",
                                    "$product.saleEndTime",
                                    { $gte: ["$product.saleStartTime", "$createdAt"] },
                                    { $lte: ["$product.saleEndTime", "$createdAt"] }
                                ]
                            },
                            then: {
                                $multiply: [
                                    "$quantity",
                                    { $subtract: ["$product.price", { $multiply: ["$product.price", { $divide: ["$product.discount", 100] }] }] }
                                ]
                            },
                            else: { $multiply: ["$quantity", "$product.price"] }
                        }
                    }
                }
            },
            {
                $project: {
                    orderId: 1,
                    productId: 1,
                    quantity: 1,
                    price: "$discountedPrice",
                    product: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!orderDetails || orderDetails.length === 0) {
            return res.status(404).json({ message: 'OrderDetails not found!' });
        }

        res.status(200).json(orderDetails);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};


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
