const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware'); 
const { isAdmin } = require('../middleware/jwt.middleware'); 

const { 
    getAllMarkets,
    getOneMarket,
    getMarketsByTown,
    createMarket,
    updateMarket,
    deleteMarket,
    toggleFavorite,
    getFavoriteMarkets 
} = require('../controllers/markets.controller');

// Rutas públicas
router.get('/', getAllMarkets);
router.get('/:id', getOneMarket);
router.get('/town/:townId', getMarketsByTown);

// Rutas para administradores
router.post('/', isAuthenticated, isAdmin, createMarket);
router.put('/:id', isAuthenticated, isAdmin, updateMarket);
router.delete('/:id', isAuthenticated, isAdmin, deleteMarket);

// Rutas para usuarios autenticados
router.post('/:id/favorite', isAuthenticated, toggleFavorite);
router.get('/user/:userId/favorites', isAuthenticated, getFavoriteMarkets);

module.exports = router;