const Role = require('../models/Role')

// route '/role'
// GET
const getAll = async (req, res) => {
    try {
        const roles = await Role.find()
        if (!roles.length) return res.status(404).json({
            error: "Role not found"
        })
        res.status(200).json(roles)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

// route '/role'
// POST
const createRole = async (req, res) => {
    try {
        const { roleName } = req.body

        if (!roleName) return res.status(500).json({
            error: 'Role name is required'
        })
        const role = await Role.create({ roleName })
        res.status(200).json({
            message: "Role created",
            role: role
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

// route '/role'
// PATCH
const updateRole = async (req, res) => {
    try {
        const { id, roleName } = req.body

        if (!roleName) return res.status(500).json({
            error: "Role name are required"
        })

        const role = await Role.findById(id)
        if (!role) return res.status(404).json({
            error: "Role ID not found"
        })

        const duplicateRoleName = Role.findOne(roleName)
        if (!duplicateRoleName) return res.status(404).json({
            error: "Role name must be unique"
        })
        role.roleName = roleName
        await role.save()
        return res.status(200).json({
            message: "Role updated"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

// route '/role'
// DELETE
const deleteRole = async (req, res) => {
    try {
        const { id } = req.body
        const role = await Role.findById(id)
        if (!role) return res.status(404).json({
            error: "Role not found"
        })
        await role.deleteOne()
        return res.status(200).json({
            message: `Deleted ${role.roleName}`
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    getAll,
    createRole,
    updateRole,
    deleteRole,
}