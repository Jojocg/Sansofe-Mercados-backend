class APIError extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.type = 'APIError';
    }
}

class RateLimitError extends APIError {
    constructor(message, waitTime) {
        super(message, 429);
        this.type = 'RateLimitError';
        this.waitTime = waitTime;
    }
}

class ValidationError extends APIError {
    constructor(message, details) {
        super(message, 400, details);
        this.type = 'ValidationError';
    }
}

class AIServiceError extends APIError {
    constructor(message, details = null) {
        super(message, 503, details);
        this.type = 'AIServiceError';
    }
}

module.exports = {
    APIError,
    RateLimitError,
    ValidationError,
    AIServiceError
};