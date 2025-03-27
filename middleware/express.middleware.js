const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { RateLimitError, ValidationError } = require('../error-handling/error.types');

// Rate limiter para la API de IA
const aiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, //limit each IP to 20 requests per windowMs
    handler: (req, res) => {
        const error = new RateLimitError(
            'Has alcanzado el límite de consultas a la IA',
            15 * 60 // tiempo en segundos hasta reset
        );
        res.status(429).json({
            error: true,
            type: error.type,
            message: error.message,
            waitTime: error.waitTime,
            retryAfter: Math.ceil(error.waitTime / 60) // minutos hasta próximo intento
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limitador general para toda la API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 40,
    handler: (req, res) => {
        const error = new RateLimitError(
            'Has alcanzado el límite de peticiones a la API',
            15 * 60
        );
        res.status(429).json({
            error: true,
            type: error.type,
            message: error.message,
            waitTime: error.waitTime,
            retryAfter: Math.ceil(error.waitTime / 60)
        });
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
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('ID de mercado inválido');
            }
            return true;
        }),
    body('townId')
        .optional({ nullable: true }) // Permite null
        .custom((value) => {
            if (value === null || value === '') return true;
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('ID de municipio inválido');
            }
            return true;
        }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationError = new ValidationError(
                'Error en la validación de la consulta',
                {
                    fields: errors.array().map(err => ({
                        field: err.path,
                        value: err.value,
                        message: err.msg
                    }))
                }
            );
            return res.status(validationError.statusCode).json({
                error: true,
                type: validationError.type,
                message: validationError.message,
                details: validationError.details
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