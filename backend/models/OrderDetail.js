const mongooose = require('mongoose')

const orderDetailSchema = new mongooose.Schema(
    {
        orderId: {
            type: mongooose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        productId: {
            type: mongooose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongooose.model('OrderDetail', orderDetailSchema)