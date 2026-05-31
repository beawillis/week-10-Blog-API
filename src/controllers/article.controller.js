const Article = require('../models/article.model');
const ApiFeatures = require('../utils/apiFeatures');

const { createArticleValidation, updateArticleValidation } = require('../validators/article.validator');

const searchArticles = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const articles = await Article.find({ $text: { $search: query } }).populate('author', 'name email');
    res.status(200).json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const { error } = createArticleValidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const article = await Article.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
    const baseQuery = Article.find().populate('author', 'name email').sort({ createdAt: -1 });
    const features = new ApiFeatures(baseQuery, req.query).search().paginate(5);

    const articles = await features.query;
    const total = await Article.countDocuments(features.query.getQuery ? features.query.getQuery() : {});

    res.status(200).json({
      success: true,
      currentPage: features.pagination.page,
      totalPages: Math.ceil(total / features.pagination.limit),
      totalArticles: total,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email');

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const { error } = updateArticleValidation(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    article.title = title || article.title;
    article.content = content || article.content;

    await article.save();

    res.status(200).json({ success: true, message: 'Article updated successfully', data: article });
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    await article.remove();
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
};