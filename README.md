# Week 10 Blog API

A production-style REST API for blog articles with JWT authentication, input validation, and MongoDB persistence.

## Overview

This project is built with Node.js, Express, and MongoDB using an MVC-oriented layout inside the src folder.

Core capabilities:
- User registration and login with hashed passwords
- JWT-based protected routes
- Create, read, update, delete operations for articles
- Optional article image uploads with Multer and Cloudinary
- Full-text search on articles
- Pagination support on article listing
- Centralized environment variable validation
- Security and logging middleware

## Tech Stack

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Joi for request validation
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage
- Helmet, CORS, Morgan

## Project Structure

```text
week-10-blog-api/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers/
│   │   ├── article.controller.js
│   │   └── auth.controller.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── models/
│   │   ├── article.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── article.routes.js
│   │   └── auth.routes.js
│   ├── utils/
│   │   ├── apiFeatures.js
│   │   └── bcrypt.js
│   └── validators/
│       ├── article.validator.js
│       └── auth.validator.js
├── server.js
├── .env.example
├── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file in the project root and copy values from .env.example.

Required variables:
- PORT
- MONGO_URI
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Optional variables:
- NODE_ENV
- CORS_ORIGIN
- CLOUDINARY_FOLDER

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/week-10-blog-api
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
CORS_ORIGIN=*
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=week-10-blog-api
```

### 3. Run the server

Development:

```bash
npm run dev
```

Production-like start:

```bash
npm start
```

Server default URL:
- http://localhost:3000

## Scripts

- npm start: Start server with Node
- npm run dev: Start server with Nodemon
- npm test: Placeholder test script

## API Endpoints

### Auth

- POST /auth/signup
- POST /auth/login

Signup request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Login request body:

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

### Articles

- POST /articles
  - Protected route
- GET /articles
- GET /articles/search?q=keyword
- GET /articles/:id
- PATCH /articles/:id
  - Protected route and owner-only
- DELETE /articles/:id
  - Protected route and owner-only

Create article request body:

```json
{
  "title": "My First Article",
  "content": "This is the article content with at least twenty characters."
}
```

To upload an image, send the request as `multipart/form-data` and include an `image` file field.

Authorization header for protected routes:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Validation Rules

Auth validation:
- Name: 3 to 50 characters
- Email: valid email format
- Password: minimum 6 characters

Article validation:
- Title: 3 to 100 characters
- Content: minimum 20 characters

Upload validation:
- Image field name: `image`
- Accepted types: common image MIME types
- Maximum size: 5MB

## Environment Validation

At startup, src/config/env.js validates required environment variables:
- PORT
- MONGO_URI
- JWT_SECRET

If any are missing or invalid, the app exits early with a clear error.

## Security and Middleware

- Helmet for HTTP security headers
- CORS support with configurable origin
- Morgan request logging
- Custom logger middleware
- Centralized error handler
- JWT auth middleware for protected routes
- Multer memory storage for incoming images
- Cloudinary upload and cleanup for article images

## Pagination and Search

GET /articles supports:
- q for text search
- page for page number
- limit for page size

Response includes:
- currentPage
- totalPages
- totalArticles
- data

## Troubleshooting

If npm start fails:
1. Confirm dependencies are installed with npm install.
2. Confirm .env exists and required variables are set.
3. Confirm MongoDB is running and MONGO_URI is correct.
4. Check that PORT is a valid number.

If protected routes return Unauthorized:
1. Make sure Authorization header is included.
2. Use format: Bearer followed by the token.
3. Ensure JWT_SECRET in .env matches the secret used to issue the token.

## License

ISC
