require('dotenv').config();

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

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};