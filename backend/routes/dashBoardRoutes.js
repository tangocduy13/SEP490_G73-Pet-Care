const express = require('express')
const router = express.Router()
const dashBoardController = require('../controllers/dashBoardController')

router.get('/order', dashBoardController.getTotalOrderByDate)
    .get('/revenue', dashBoardController.getTotalRevenueByDate)
    .get('/customer', dashBoardController.getTotalCustomerByDate)
    .get('/product-sold', dashBoardController.getTotalProductsSoldByDate)
    .get('/revenue-statistics', dashBoardController.getRevenueStatistics)


module.exports = router    