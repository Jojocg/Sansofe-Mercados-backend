const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware'); 
const { isAdmin } = require('../middleware/jwt.middleware'); 

const { getAllTowns,
    getOneTown,
    createTown,
    updateTown,
    deleteTown 
} = require('../controllers/towns.controller')

// Rutas públicas
router.get('/', getAllTowns)
router.get('/:id', getOneTown)

// Rutas para administradores
router.post('/', isAuthenticated, isAdmin, createTown)
router.put('/:id', isAuthenticated, isAdmin, updateTown)
router.delete('/:id', isAuthenticated, isAdmin, deleteTown)

module.exports = router