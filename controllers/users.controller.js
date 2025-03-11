const User = require('../models/User.model');
const mongoose = require("mongoose");

async function getAllUsers(req, res) {
    try {
        const users = await User.find({})
        if (users) {
            return res.status(200).json(users)
        } else {
            return res.status(404).send('Usuarios no encontrados')
        }
    } catch (err) {
        /* console.log("Error while getting the users", err); */
        res.status(500).json({ message: "Error al obtener los usuarios" })
    }
}

async function getOneUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        const user = await User.findById(req.params.id)
        if (user) {
            return res.status(200).json(user)
        } else {
            return res.status(404).send('Usuario no encontrado')
        }
    } catch (err) {
        /* console.log("Error while retrieving the user", err); */
        res.status(500).json({ message: "Error al obtener el usuario" })
    }
}

async function createUser(req, res) {
    try {
        const user = await User.create(req.body)
        return res.status(201).json({ message: 'Usuario creado', user })
    } catch (err) {
        /* console.log("Error while creating the user", err); */
        res.status(500).json({ message: "Error al crear el usuario" })
    }
}

async function updateUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.status(200).json({ message: 'Municipio actualizado', updatedUser })
    } catch (err) {
        /* console.log("Error while updating the user", err); */
        res.status(500).json({ message: "Error al actualizar el usuario" })
    }
}

async function deleteUser(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        return res.status(204).json({ message: 'Usuario eliminado' });
    } catch (err) {
        /* console.log("Error while deleting the user", err); */
        res.status(500).json({ message: "Error al eliminar el usuario" })
    }
}

async function getOneProfile(req, res) {
    // Obtener el ID del usuario desde el payload del JWT
    // que fue añadido por el middleware isAuthenticated
    const userId = req.payload._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        const profile = await User.findById(userId)
        if (profile) {
            return res.status(200).json(profile)
        } else {
            return res.status(404).send('Perfil no encontrado')
        }
    } catch (err) {
        /* console.log("Error while retrieving the profile", err); */
        res.status(500).json({ message: "Error al obtener el perfil" })
    }
}

async function updateProfile(req, res) {
    const userId = req.payload._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        const updatedProfile = await User.findByIdAndUpdate(userId, req.body, { new: true })
        return res.status(200).json({ message: 'Perfil actualizado', updatedProfile })
    } catch (err) {
        /* console.log("Error while updating the profile", err); */
        res.status(500).json({ message: "Error al actualizar el perfil" })
    }
}

async function deleteProfile(req, res) {
    const userId = req.payload._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        await User.findByIdAndDelete(userId);
        return res.status(204).json({ message: 'Perfil eliminado' });
    } catch (err) {
        /* console.log("Error while deleting the user", err); */
        res.status(500).json({ message: "Error al eliminar el perfil" })
    }
}

module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    getOneProfile,
    updateProfile,
    deleteProfile
}