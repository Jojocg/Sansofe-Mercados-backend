const Town = require('../models/Town.model');
const mongoose = require("mongoose");

async function getAllTowns(req, res) {
    try {
        const towns = await Town.find({})
        if (towns) {
            return res.status(200).json(towns)
        } else {
            return res.status(404).send('Municipios no encontrados')
        }
    } catch (err) {
        /* console.log("Error while getting the towns", err); */
        res.status(500).json({ message: "Error al obtener los municipios" })
    }
}

async function getOneTown(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        const town = await Town.findById(req.params.id)
        if (town) {
            return res.status(200).json(town)
        } else {
            return res.status(404).send('Municipio no encontrado')
        }
    } catch (err) {
        /* console.log("Error while retrieving the town", err); */
        res.status(500).json({ message: "Error al obtener el municipio" })
    }
}

async function createTown(req, res) {
    try {
        const town = await Town.create(req.body)
        return res.status(201).json({ message: 'Municipio creado', town })
    } catch (err) {
        /* console.log("Error while creating the town", err); */
        res.status(500).json({ message: "Error al crear el municipio" })
    }
}

async function updateTown(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    try {
        const updatedTown = await Town.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.status(200).json({ message: 'Municipio actualizado', updatedTown })
    } catch (err) {
        /* console.log("Error while updating the town", err); */
        res.status(500).json({ message: "Error al actualizar el municipio" })
    }
}

async function deleteTown(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        // para verificar si existen mercados asociados a este municipio
        const Market = require('../models/Market.model');
        const relatedMarkets = await Market.countDocuments({ town: req.params.id });
        
        if (relatedMarkets > 0) {
            return res.status(409).json({ 
                message: `No se puede eliminar el municipio porque tiene ${relatedMarkets} mercados asociados. Elimine primero los mercados.`
            });
        }

        // Si no hay mercados asociados, entonces se procede con la eliminación
        const town = await Town.findByIdAndDelete(req.params.id)
        return res.status(204).json({ message: 'Municipio eliminado'})
    } catch (err) {
        /* console.log("Error while deleting the town", err); */
        res.status(500).json({ message: "Error al eliminar el municipio" })
    }
}

module.exports = {
    getAllTowns,
    getOneTown,
    createTown,
    updateTown,
    deleteTown
}