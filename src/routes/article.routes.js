const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
} = require('../controllers/article.controller');

router.post('/', authMiddleware, createArticle);
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);
router.patch('/:id', authMiddleware, updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;