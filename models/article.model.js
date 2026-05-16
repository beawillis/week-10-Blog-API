const mongoose = require('mongoose');
const articleSchema = new mongoose.Schema({ // Define the Article schema
  title: {
    type: String,
    required: true,
    trim: true,
    },

    content: {
    type: String,
    required: true
    },

    author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    }
}, {
    timestamps: true
}
);
// Create a text index on the title and content fields for search functionality
articleSchema.index({ title: 'text', content: 'text' });


module.exports = mongoose.model('Article', articleSchema);