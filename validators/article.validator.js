const joi = require('joi');

//Create article validation schema
const createArticleValidation = (data) => {
    const schema = joi.object({
        title: joi.string().min(3).max(100).required(), // Title must be a string between 3 and 100 characters
        content: joi.string().min(20).required() // Content must be a string with at least 20 characters
    });
    return schema.validate(data); // Validate the input data against the schema
}

// Update article validation schema
const updateArticleValidation = (data) => {
    const schema = joi.object({
        title: joi.string().min(3).max(100), // Title must be a string between 3 and 100 characters
        content: joi.string().min(20) // Content must be a string with at least 20 characters
    });
    return schema.validate(data); // Validate the input data against the schema
}


module.exports = { createArticleValidation, updateArticleValidation }; // Export the validation functions for use in other files