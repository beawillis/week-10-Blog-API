const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth'); // Import the authentication middleware
const {
     createArticle, 
     getAllArticles, 
     getArticleById, 
     updateArticle, 
     deleteArticle, 
     searchArticles } = require('../controllers/article.controller'); // Import the article controllers
     
// Define the routes for article operations
router.post('/', authMiddleware, createArticle); // Create a new article (requires authentication)
router.get('/', getAllArticles); // Get all articles

router.get('/search', searchArticles); // Search articles by title or content

router.get('/:id', getArticleById); // Get a specific article by ID
router.patch('/:id', authMiddleware, updateArticle); // Update a specific article by ID (requires authentication)
router.delete('/:id', authMiddleware, deleteArticle); // Delete a specific article by ID (requires authentication)

module.exports = router; // Export the router to be used in the main application