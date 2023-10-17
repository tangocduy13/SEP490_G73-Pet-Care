const Service = require('../models/Service')

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
        const { serviceName, status, description, price, title, type, serviceImage } = req.body
        const service = await Service.create({ serviceName, status, description, price, title, type, serviceImage })
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

module.exports = {
    getAll,
    createService,
    updateService
}