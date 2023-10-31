const Category = require('../models/Category')

// route '/category'
// GET
const getAll = async (req, res) => {
    try {
        const categories = await Category.find()
        if (!categories.length) return res.status(404).json({
            error: "Category not found"
        })
        res.status(200).json(categories)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
const createCategory = async (req, res) => {
    try {
        const { categoryName, feature } = req.body
        const category = await Category.create({ categoryName, feature })
        res.status(201).json(category)
    } catch (err) {
        console.log(err)
    }
}
// route '/role'
// PATCH
const updateCategory = async (req, res) => {
    try {
        const { id, categoryName, feature } = req.body
        const category = await Category.findById(id)
        if (!category) return res.status(404).json({
            error: "Category ID not found"
        })
        category.categoryName = categoryName
        category.feature = feature

        await category.save()
        return res.status(200).json({
            message: `Updated category ${categoryName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
// route '/category'
// DELETE
const deleteOne = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        if (!category) return res.status(404).json({
            error: "Cacategory not found"
        })
        await Category.findByIdAndDelete(id)
        return res.status(200).json({
            message: `Deleted ${category.categoryName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
// route '/catename/:name'
// GET
const getCategoryByName = async (req, res) => {
    try {
        const { name } = req.params
        const category = await Category.find({ categoryName: { $regex: name } })
        if (!category) {
            res.json({
                error: "Category not found"
            })
        }
        return res.status(200).json({
            data: category
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}
module.exports = {
    createCategory,
    getAll,
    updateCategory,
    deleteOne,
    getCategoryByName
}