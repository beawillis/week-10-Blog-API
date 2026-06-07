require('dotenv').config();

// Required core environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];

const missingEnvVars = requiredEnvVars.filter((key) => {
  const value = process.env[key];
  return !value || value.trim() === '';
});

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const port = Number(process.env.PORT);

if (Number.isNaN(port)) {
  throw new Error('PORT must be a valid number');
}

// Cloudinary values are optional. Trim to avoid leading/trailing spaces causing issues.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.trim() : '';
const cloudApiKey = process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : '';
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : '';
const cloudFolder = process.env.CLOUDINARY_FOLDER ? process.env.CLOUDINARY_FOLDER.trim() : 'week-10-blog-api';

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  cloudinary: {
    cloudName,
    apiKey: cloudApiKey,
    apiSecret: cloudApiSecret,
    folder: cloudFolder,
  },
};
