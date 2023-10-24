const Service = require('../models/Service')
const Category = require('../models/Category')

// route: "/service"
// method: GET
const getAll = async (req, res) => {
    try {
        const services = await Service.find()
        if (!services) return res.status(404).json({
            error: 'No service found'
        })
        res.status(200).json(services)
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
        const { id, serviceName, status, description, price, title, type, serviceImage } = req.body
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
        const { cateId } = req.body
        const services = await Service.find({ categoryId: cateId })
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
const deleteById = async (req, res) => {
    try {
        const { id } = req.body
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