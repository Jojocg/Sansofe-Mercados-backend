const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Rate limiter para la API de IA
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // limit each IP to 20 requests per windowMs
    message: 'Demasiadas consultas realizadas. Por favor, inténtalo de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Limitador general para toda la API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 40,
    message: {
        error: true,
        message: 'Demasiadas peticiones realizadas. Por favor, inténtalo de nuevo más tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation middleware
const validateAIRequest = [
    body('query')
        .trim()
        .notEmpty()
        .withMessage('La consulta no puede estar vacía')
        .isString()
        .withMessage('La consulta debe ser texto')
        .isLength({ min: 2, max: 500 })
        .withMessage('La consulta debe tener entre 2 y 500 caracteres'),
    body('marketId')
        .optional({ nullable: true }) // Permite null
        .custom((value) => {
            if (value === null || value === '') return true;
            return mongoose.Types.ObjectId.isValid(value);
        })
        .withMessage('ID de mercado inválido'),
    body('townId')
        .optional({ nullable: true }) // Permite null
        .custom((value) => {
            if (value === null || value === '') return true;
            return mongoose.Types.ObjectId.isValid(value);
        })
        .withMessage('ID de municipio inválido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Error de validación',
                details: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    aiRateLimiter,
    generalLimiter,
    validateAIRequest
};