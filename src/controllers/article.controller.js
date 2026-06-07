const Article = require("../models/article.model");
const ApiFeatures = require("../utils/apiFeatures");
const { createArticleValidation, updateArticleValidation } = require("../validators/article.validator");

exports.createArticle = async (req, res) => {
  try {
    // Allow image-only posts: if an image is uploaded, require only a valid title.
    let error = null;
    if (req.file) {
      const titleSchema = { title: { type: 'string' } };
      // simple runtime check for title length
      if (!req.body.title || req.body.title.length < 3 || req.body.title.length > 100) {
        return res.status(400).json({ message: 'Title is required and must be 3-100 characters' });
      }
    } else {
      const validation = createArticleValidation(req.body);
      error = validation.error;
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
    }

    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      image: req.file ? req.file.path : null,
      author: req.user._id,
    });

    if (req.file) {
      return res.status(201).json({ success: true, message: 'Image uploaded successfully', data: article });
    }

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getAllArticles = async (req, res, next) => {
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

exports.searchArticles = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(query, "i");
    const articles = await Article.find({
      $or: [{ title: regex }, { content: regex }],
    }).populate("author", "name email");

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("author", "name email");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { error } = updateArticleValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;
    if (req.file) {
      article.image = req.file.path;
    }

    await article.save();

    if (req.file) {
      return res.status(200).json({ success: true, message: 'Image uploaded successfully', data: article });
    }

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.author && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await article.deleteOne();
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};