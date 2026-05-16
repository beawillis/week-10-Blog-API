const Article = require('../models/article.model');
const { search } = require('../routes/auth.routes');

const {
    createArticleValidation,
    updateArticleValidation
} = require('../validators/article.validator');

// Search Articles
const searchArticles = async (req, res, next) => {
    try {
        const query = req.query.q ;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }
        const articles = await Article.find({ $text: { $search: query } }).populate('author', 'name email');
        res.status(200).json({ success: true, data: articles });
    } catch (error) {
        next(error);
    }
};

// Create Article
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
            author: req.user._id
        });
        
        res.status(201).json({ 
            success: true,
            message: 'Article created successfully',
            data: article
        })
    } catch (error) {
        next(error);
    }
};

// Get All Articles
const getAllArticles = async (req, res, next) => {
    try {
        // Optional text search via `q` query param
         const search = req.query.q || "";

         // PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const query = search ? { $text: { $search: search } } : {};

        const articles = await Article.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalArticles: total,
            data: articles
        });
    } catch (error) {
        next(error);
    }
};

// Get Article by ID
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

// Update Article
const updateArticle = async (req, res, next) => {
    try {
        const { title, content } = req.body; 
        
        // Validate the input data
        const { error } = updateArticleValidation(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }

        //ownership check
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

// Delete Article
const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ success: false, message: 'Article not found' });
        }
        //ownership check
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