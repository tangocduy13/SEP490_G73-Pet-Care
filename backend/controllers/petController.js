const Pet = require('../models/Pet')

const getAll = async (req, res) => {
    try {
        const pets = await Pet.find()
        if (!pets) return res.status(404).json({
            error: "404 Pet not found"
        })
        res.status(200).json(pets)
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

module.exports = {
    getAll,
    createPet,
    updatePet
}