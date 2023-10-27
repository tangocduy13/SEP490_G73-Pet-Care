const Pet = require('../models/Pet')

const getAll = async (req, res) => {
    try {
        const { sortPrice, page, limit } = req.query

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