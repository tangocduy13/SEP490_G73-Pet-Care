const Pet = require('../models/Pet')
const User = require('../models/User')
const BookingDetail = require('../models/BookingDetail')
const CartService = require('../models/CartService');
const mongoose = require('mongoose')

const getAll = async (req, res) => {
  try {
    const { page, limit, categoryId } = req.query

    const query = {}

    if (categoryId) {
      query.categoryId = categoryId;
    }

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    }

    const result = await Pet.paginate(query, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      populate: {
        path: 'userId',
        model: 'User',
        select: 'fullname phone',
      }
    })

    if (!result || result.docs === 0) {
      return res.status(404).json({
        error: "There are no Pet in the Database",
      });
    }
    res.status(200).json(result);

  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const uploadPetImage = async (req, res) => {
  try {
    const originalFileName = req.file ? req.file.originalname : ''
    const imageUrl = `http://localhost:3500/image/pet/${originalFileName}`
    res.status(200).json({
      image: imageUrl
    })
  } catch (error) {

  }
}

const createPet = async (req, res) => {
  try {
    const { userId, petName, rank, status, categoryId, color, weight, height, petImage } = req.body
    const pet = await Pet.create({ userId, petName, rank, status, categoryId, color, weight, height, petImage })
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
    const { id, userId, petName, rank, status, categoryId, color, weight, height, petImage } = req.body
    const pet = await Pet.findById(id)
    pet.userId = userId
    pet.petName = petName
    pet.rank = rank
    pet.status = status
    pet.categoryId = categoryId
    pet.color = color
    pet.weight = weight
    pet.height = height
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

const updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body
    const updatePet = await Pet.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    )
    res.json(updatePet)
  } catch (error) {
    console.log(error)
    res.json({ error: "Internal Server Error" })
  }
}

// route /pet/username?name=
// GET
const getPetByUsername = async (req, res) => {
  try {
    const searchTerm = req.query.name || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find the user based on the provided username
    const users = await User.find({ fullname: new RegExp(searchTerm, 'i') });

    // Extract the user IDs from the found users
    const userIds = users.map(user => user._id);

    // Find pets where userId is in the list of found user IDs
    // const petPaginateResult = await Pet.paginate({ userId: { $in: userIds } }, { page, limit });

    // nếu cần thêm cả thông tin của user thì dùng câu lệnh bên dưới
    const petPaginateResult = await Pet.paginate({ userId: { $in: userIds } }, {
      page, limit, populate: {
        path: 'userId',
        select: 'fullname',
      }
    });

    res.json(petPaginateResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
// route /pet/userid?
// GET
const getPetByUserId = async (req, res) => {
  try {
    const userId = req.query.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    // Find pet by user id
    const pets = await Pet.paginate({ userId: userId }, {
      page, limit, populate: {
        path: 'userId'
      }
    })
    res.json(pets)
  } catch (error) {
    console.log(error)
    res.json("Internal server error")
  }
}
const getPetListForServiceBooking = async (req, res) => {
  try {
    const { serviceId, userId } = req.body;
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    // Find pet by user id
    const pets = await Pet.paginate({ userId: userId }, {
      page, limit, populate: {
        path: 'userId'
      }
    })

    const cartItems = await CartService.find({ userId }).populate('petId').populate('serviceId');

    for (let i = 0; i < cartItems.length; i++) {
      for (let j = 0; j < pets.docs.length; j++) {
        if (pets.docs[j]._id.toString() === cartItems[i].petId._id.toString() && serviceId === cartItems[i].serviceId._id.toString()) {
          pets.docs.splice(j, 1);
        }
      }
    }
    res.status(200).json(pets.docs);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error")
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Pet.findByIdAndDelete(id)
    if (result) {
      res.status(201).json(`Deleted pet ${id}`);
    }
  } catch (error) {
    res.status(500).json("Internal Server Error")
    console.log(error)
  }
}

module.exports = {
  getAll,
  createPet,
  updatePet,
  getPetByUsername,
  getPetByUserId,
  updateStatus,
  uploadPetImage,
  getPetListForServiceBooking,
  deleteOne
}