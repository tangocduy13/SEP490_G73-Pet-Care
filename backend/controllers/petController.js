const Pet = require('../models/Pet')
const mongoosePaginate = require('mongoose-paginate');

const getAll = async (req, res) => {
    try {
        const { page, limit } = req.query

        const query = {}

        const options = {
            page: parseInt(page) || 1, // mặc định trang là 1
            limit: parseInt(limit) || 10, // tạm thời để là 5 cho An test paging
        }

        const result = await Pet.paginate(query, options)

        if (!result.docs || result.docs.length === 0) {
            return res.status(404).json({
                error: "There are no Service in the Database",
            });
        }
        res.status(200).json(result);

    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const createPet = async (req, res) => {
    try {
        const { userId, petName, rank, status, category, petImage } = req.body
        const pet = await Pet.create({ userId, petName, rank, status, category, petImage })
        res.status(201).json({
            message: "Created successful",
            pet: pet
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const updatePet = async (req, res) => {
    try {
        const { id, userId, petName, rank, status, category, petImage } = req.body
        const pet = await Pet.findById(id)
        pet.userId = userId
        pet.petName = petName
        pet.rank = rank
        pet.status = status
        pet.category = category
        pet.petImage = petImage

        await pet.save()
        res.status(201).json({
            message: `Updated ${petName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

const getPetByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const pet = await Pet.find({ userId: id })
        res.status(200).json({
            data: pet
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    createPet,
    updatePet,
    getPetByUserId,
}