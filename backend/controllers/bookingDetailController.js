const BookingDetail = require('../models/BookingDetail');

const getBookingDetailByBookingId = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const bookingDetails = await BookingDetail.find({ bookingId })?.populate('serviceId').populate('petId');
        if (!bookingDetails) {
            return res.status(404).json({ 
                message: 'BookingDetail not found!' 
            });
          }
        res.status(200).json(bookingDetails)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createBookingDetail = async (req, res) => {
    try {
        const { serviceId, quantity } = req.body;
        const bookingId = req.params.bookingId;
        const newBookingDetail = new BookingDetail({ bookingId, serviceId, quantity });
        const result = await newBookingDetail.save();
        if (!result){
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

module.exports = {
    getBookingDetailByBookingId,
    createBookingDetail
}
