const Service = require('../models/Service')
const Category = require('../models/Category')

// route: "/service"
// method: GET
const getAll = async (req, res) => {
    try {
        const { sortPrice, page, limit, serviceName } = req.query

        const query = {}

        const options = {
            page: parseInt(page) || 1, // mặc định trang là 1
            limit: parseInt(limit) || 10, // tạm thời để là 5 cho An test paging
            query: { serviceName: { $regex: serviceName, $options: 'i' } } // Apply the "like" query
        }
        if (sortPrice === 'asc') {
            options.sort = { price: 1 } // sắp xếp giá theo giá tăng dần
        } else if (sortPrice === 'desc') {
            options.sort = { price: -1 } // sắp xếp theo giá giảm dần
        }

        const result = await Service.paginate(query, options)

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Service in the Database",
            });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
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
        const { id, serviceName, status, description, price, title, type, categoryId, serviceImage } = req.body
        const service = await Service.findById(id)
        if (!service) return res.status(404).json({
            error: "Service not found"
        })
        service.serviceName = serviceName
        service.status = status
        service.description = description
        service.price = price
        service.title = title
        service.type = type
        service.categoryId = categoryId
        service.serviceImage = serviceImage
        const result = await service.save()
        if (!result) return res.status(400).json({
            error: "Update fail"
        })
        res.status(201).json({
            message: `Updated service ${service.serviceName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
// route: "/service/find"
// method: GET
const findServiceByCateId = async (req, res) => {
    try {
        const { id } = req.params
        const services = await Service.find({ categoryId: id })
        if (!services) {
            res.json(404).json({
                error: "Service not found"
            })
        }
        res.status(201).json(services)
    } catch (err) {
        console.log(err)
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
    findServiceByCateId
}