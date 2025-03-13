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
