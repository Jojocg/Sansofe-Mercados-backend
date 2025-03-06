const Market = require('../models/Market.model');
const mongoose = require("mongoose");

async function getAllMarkets(req, res) {
    try {
        // Populate para incluir la información del municipio en la respuesta
        const markets = await Market.find({}).populate('town', 'name');
        if (markets) {
            return res.status(200).json(markets);
        } else {
            return res.status(404).send('Mercados no encontrados');
        }
    } catch (err) {
        res.status(500).json({ message: "Error al obtener los mercados" });
    }
}

async function getOneMarket(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        // Populate para incluir la información del municipio en la respuesta
        const market = await Market.findById(req.params.id).populate('town', 'name');
        if (market) {
            return res.status(200).json(market);
        } else {
            return res.status(404).send('Mercado no encontrado');
        }
    } catch (err) {
        res.status(500).json({ message: "Error al obtener el mercado" });
    }
}

async function getMarketsByTown(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.townId)) {
        res.status(400).json({ message: 'Specified town id is not valid' });
        return;
    }

    try {
        const markets = await Market.find({ town: req.params.townId });
        if (markets.length > 0) {
            return res.status(200).json(markets);
        } else {
            return res.status(200).json([]); // Devolver array vacío si no hay mercados
        }
    } catch (err) {
        res.status(500).json({ message: "Error al obtener los mercados del municipio" });
    }
}

async function createMarket(req, res) {
    try {
        const market = await Market.create(req.body);
        return res.status(201).json({ message: 'Mercado creado', market });
    } catch (err) {
        res.status(500).json({ message: "Error al crear el mercado", error: err.message });
    }
}

async function updateMarket(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }
    
    try {
        const updatedMarket = await Market.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.status(200).json({ message: 'Mercado actualizado', updatedMarket });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar el mercado" });
    }
}

async function deleteMarket(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    try {
        await Market.findByIdAndDelete(req.params.id);
        return res.status(204).json({ message: 'Mercado eliminado' });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el mercado" });
    }
}

// Función para que los usuarios puedan añadir o quitar un mercado de favoritos
async function toggleFavorite(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ message: 'Specified market id is not valid' });
        return;
    }

    try {
        // Obtener el ID del usuario desde el payload del JWT
        // que fue añadido por el middleware isAuthenticated
        const userId = req.payload._id;
        
        // Buscar el usuario
        const user = await require('../models/User.model').findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comprobar si el mercado ya está en favoritos
        const marketIndex = user.favs.indexOf(req.params.id);
        
        // Si ya está en favoritos, quitarlo
        if (marketIndex !== -1) {
            user.favs.splice(marketIndex, 1);
            await user.save();
            return res.status(200).json({ message: 'Mercado eliminado de favoritos', isFavorite: false });
        } 
        // Si no está en favoritos, añadirlo
        else {
            user.favs.push(req.params.id);
            await user.save();
            return res.status(200).json({ message: 'Mercado añadido a favoritos', isFavorite: true });
        }
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar favoritos", error: err.message });
    }
}

// Función para obtener todos los mercados favoritos de un usuario
// El frontend enviaría una petición GET a /markets/user/:userId/favorites
async function getFavoriteMarkets(req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        res.status(400).json({ message: 'Specified user id is not valid' });
        return;
    }

    try {
        const user = await require('../models/User.model').findById(req.params.userId).populate({
            path: 'favs',
            populate: {
                path: 'town',
                select: 'name'
            }
        });
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json(user.favs);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener mercados favoritos", error: err.message });
    }
}

module.exports = {
    getAllMarkets,
    getOneMarket,
    getMarketsByTown,
    createMarket,
    updateMarket,
    deleteMarket,
    toggleFavorite,
    getFavoriteMarkets
};