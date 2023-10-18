const Booking = require('../models/Booking');
const BookingDetail = require('../models/BookingDetail');

const getAllBooking = async (req, res) => {
    try {
        const bookings = await Booking.find()
        if (!bookings){
            return res.status(404).json({
                error: "There are no Bookings in the Database"
            })
        } 
        res.status(200).json(bookings)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getAllBookingByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const bookings = await Booking.find({ userId });
        if (!bookings){
            return res.status(404).json({
                error: "UserId = :" + userId + " has no Bookings in the Database"
            })
        }
        res.status(200).json(bookings)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createBooking = async (req, res) => {
    try {
        const { userId, petId, totalPrice } = req.body;
        const booking = new Booking();
        booking.userId = userId;
        booking.petId = petId;
        booking.totalPrice = totalPrice;
        booking.status = false;
        const result = await booking.save();
        if (!result){
            return res.status(404).json({
                error: "Can not create Booking"
            })
        } 
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { userId, petId, totalPrice, status } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking){
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } 
        booking.userId = userId;
        booking.petId = petId;
        booking.totalPrice = totalPrice;
        booking.status = status;
        const result = await booking.save();
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const acceptBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking){
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } 
        booking.status = true;
        const result = await booking.save();
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const booking = await Booking.findById(bookingId);
        if (!booking){
            return res.status(404).json({
                error: "Booking: " + bookingId + " not found!"
            })
        } 
        const bookingDetails = await BookingDetail.find({ bookingId });
        if(bookingDetails!= null){
            await BookingDetail.deleteMany({ bookingId })
        }
        await Booking.findByIdAndRemove(bookingId);
        res.json({ message: 'Delete Booking success!' });
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}



module.exports = {
    getAllBooking,
    getAllBookingByUserId,
    createBooking,
    updateBooking,
    acceptBooking,
    deleteBooking
}