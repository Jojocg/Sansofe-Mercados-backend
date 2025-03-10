const router = require('express').Router();
const { isAuthenticated } = require('../middleware/jwt.middleware'); 
const { isAdmin } = require('../middleware/jwt.middleware'); 

const { 
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    getOneProfile,
    updateProfile,
    deleteProfile 
} = require('../controllers/users.controller');

// Rutas para administradores
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get('/:id', isAuthenticated, isAdmin, getOneUser);
router.post('/', isAuthenticated, isAdmin, createUser);
router.put('/:id', isAuthenticated, isAdmin, updateUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

// Rutas para usuarios autenticados
router.get('/profile/:id', isAuthenticated, getOneProfile);
router.put('/profile/:id', isAuthenticated, updateProfile);
router.delete('/profile/:id', isAuthenticated, deleteProfile);

module.exports = router;