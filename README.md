# Sansofé Project Server

## Overview
The Sansofe Project Server is a Node.js backend application built with Express.js and MongoDB. It provides a RESTful API for the Sansofe platform, handling authentication and data storage.

## Features
- RESTful API architecture
- JWT-based authentication and authorization
- MongoDB database integration with Mongoose ODM
- Secure password handling with bcrypt
- Environment configuration with dotenv
- Cross-Origin Resource Sharing (CORS) support
- Request logging with Morgan

## Technology Stack
- **Node.js**: Runtime environment
- **Express.js**: v4.21.2 - Web server and API framework
- **MongoDB**: Database (via Mongoose v8.11.0)
- **JWT**: v9.0.2 - For authentication
- **bcrypt**: v5.1.1 - For password hashing
- **cors**: v2.8.5 - For CORS support
- **morgan**: v1.10.0 - For HTTP request logging

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB (local installation or MongoDB Atlas account)
- npm package manager

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/Jojocg/Sansofe-Project-backend.git
   cd Sansofe-Project-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables as examples:
   ```
   PORT=5005
   MONGODB_URI=mongodb://127.0.0.1:27017/sansofe_db
   TOKEN_SECRET=your_jwt_secret_key
   ORIGIN=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. The API will be available at `http://localhost:5005`

## Project Structure
```
sansofe-project-server/
├── config/             # Configuration files for frontend connection
├── controllers/        # Request controllers
├── db/                 # Database connection setup
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── server.js           # Entry point
```

## AI Integration

### Overview
The project integrates with Google's Gemini AI to provide intelligent responses about local markets in Gran Canaria. This integration enhances user experience by offering:
- Natural language interactions about markets
- Context-aware responses based on specific markets or towns
- Intelligent filtering of market information

### Features
- 🤖 **Smart Assistant**: Provides detailed information about local markets
- 🔒 **Rate Limiting**: Protects the AI service with 20 requests per IP per 15 minutes
- ⚡ **Response Caching**: Improves performance for repeated queries
- 🔍 **Context-Aware**: Tailored responses based on specific market or town context

### Technical Implementation
<details>
<summary>AI Request Flow</summary>

1. **Request Validation**
   ```javascript
   POST /api/ai/assistant
   {
     "query": "string",     // Required: User's question
     "marketId": "string",  // Optional: Specific market
     "townId": "string"     // Optional: Specific town
   }
   ```

2. **Response Format**
   ```javascript
   {
     "response": "string"   // AI-generated response
   }
   ```

3. **Error Handling**
   ```javascript
   {
     "error": true,
     "type": "ErrorType",
     "message": "Error description",
     "details": {}
   }
   ```
</details>

<details>
<summary>Security Measures</summary>

- Request validation and sanitization
- Rate limiting protection
- Input length restrictions
- Context-based response filtering
</details>

### Dependencies Added
- `@google/generative-ai`: Gemini AI integration
- `express-rate-limit`: API request limiting
- `express-validator`: Request validation

### Environment Variables
Add to your `.env`:
```
GEMINI_API_KEY=your_gemini_api_key
```

### Usage Limits
- 20 AI requests per IP address per 15 minutes
- Maximum query length: 500 characters
- Response caching for queries under 5000 characters

## Additional Documentation
For more details about the AI integration, check:
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- [Express Validator](https://express-validator.github.io/)
