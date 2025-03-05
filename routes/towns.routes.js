const router = require('express').Router();

const { getAllTowns,
    getOneTown,
    createTown,
    updateTown,
    deleteTown } = require('../controllers/towns.controller')

// ADMINS

router.get('/', getAllTowns)
router.get('/:id', getOneTown)
router.post('/:id', createTown)
router.put('/:id', updateTown)
router.delete('/:id', deleteTown)

module.exports = router