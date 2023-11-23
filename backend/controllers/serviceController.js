const Service = require('../models/Service')
const Category = require('../models/Category')
const mongoose = require('mongoose')

// route: "/service"
// method: GET
const getAll = async (req, res) => {
    try {
        const { sortPrice, page, limit, categoryId, service } = req.query
        const query = {}
        if (categoryId) {
            query.categoryId = categoryId || ''
        }
        if (service) {
            query.serviceName = { $regex: new RegExp(service, 'i') };
        }
        const options = {
            page: parseInt(page) || 1, // mặc định trang là 1
            limit: parseInt(limit) || 10, // tạm thời để là 5 cho An test paging
            query: query
        }
        if (sortPrice === 'asc') {
            options.sort = { price: 1 } // sắp xếp giá theo giá tăng dần
        } else if (sortPrice === 'desc') {
            options.sort = { price: -1 } // sắp xếp theo giá giảm dần
        }

        const result = await Service.paginate(query, options)

        if (!result.docs || result.docs.length === 0) {
            return res.json({
                error: "There are no Service in the Database",
            });
        }
        // Map each document to include the discountedPrice
        const servicesWithDiscountedPrice = result.docs.map(service => {
            return {
                ...service.toObject(),
                discountedPrice: service.discountedPrice // Include discountedPrice in each service
            };
        });

        // Include services with discountedPrice in the response
        const response = {
            ...result,
            docs: servicesWithDiscountedPrice
        };
        res.status(200).json(response);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
const uploadServiceImage = async (req, res) => {
    try {
        const originalFileName = req.file ? req.file.originalname : '';
        const imageUrl = `http://localhost:3500/image/service/${originalFileName}`
        res.status(200).json({
            image: imageUrl
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" })
    }
}
// route: "/service"
// method: POST
const createService = async (req, res) => {
    try {
        const { serviceName, status, description, price, categoryId, serviceImage } = req.body
        const service = await Service.create({ serviceName, status, description, price, categoryId, serviceImage })
        if (!service) return res.status(500).json({
            error: "Create fail"
        })
        res.status(201).json({
            message: "Create successful",
            service: service
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
// route: "/service"
// method: PATCH
const updateService = async (req, res) => {
    try {
        const { id, serviceName, status, description, price, discount, saleStartTime, saleEndTime, title, type, categoryId, serviceImage } = req.body
        const service = await Service.findById(id)
        if (!service) return res.status(404).json({
            error: "Service not found"
        })
        service.serviceName = serviceName
        service.status = status
        service.description = description
        service.price = price
        service.discount = discount
        service.saleStartTime = saleStartTime
        service.saleEndTime = saleEndTime
        service.title = title
        service.type = type
        service.categoryId = categoryId
        service.serviceImage = serviceImage

        const updatedService = await service.save()
        const serviceWithDiscountedPrice = updatedService.toObject({ virtuals: true });

        res.status(201).json({
            message: `Updated service ${service.serviceName}`,
            service: serviceWithDiscountedPrice
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

// route: "/service"
// method: DELETE
const deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await Service.findByIdAndDelete(id).then(() => {
            res.status(201).json({
                message: `Deleted ${id}`
            })
        })

    } catch (err) {
        console.log(err)
        res.status(400)
    }
}
const deleteMany = async (req, res) => {
    try {
        const result = await Service.deleteMany({ status: false })
        res.status(201).json()
    } catch (err) {
        console.log(err)
        res.status(400)
    }
}

module.exports = {
    getAll,
    createService,
    updateService,
    deleteMany,
    deleteById,
    uploadServiceImage,
}