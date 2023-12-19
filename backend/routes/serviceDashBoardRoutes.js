const express = require('express')
const router = express.Router()
const serviceDashBoardController = require('../controllers/serviceDashBoardController')

router.get('/booking', serviceDashBoardController.getTotalBookingByDate)
    .get('/revenue', serviceDashBoardController.getTotalRevenueByDate)
    .get('/customer', serviceDashBoardController.getTotalCustomer)
    // .get('/product-sold', dashBoardController.getTotalProductsSoldByDate)
    .get('/revenue-statistics', serviceDashBoardController.getRevenueStatistics)


module.exports = router    