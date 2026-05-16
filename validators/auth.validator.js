const joi = require('joi'); // Import Joi library for data validation

//register validation schema
const registervalidation = (data) => {
    const schema = joi.object({
        name: joi.string().min(3).max(50).required(), // Name must be a string between 3 and 50 characters
        email: joi.string().email().required(), // Email must be a valid email address
        password: joi.string().min(6).required() // Password must be a string with at least 6 characters
    });
    return schema.validate(data); // Validate the input data against the schema
}   

//login validation schema
const loginvalidation = (data) => {
    const schema = joi.object({
        email: joi.string().email().required(), // Email must be a valid email address
        password: joi.string().min(6).required() // Password must be a string with at least 6 characters
    });
    return schema.validate(data); // Validate the input data against the schema
}

module.exports = { registervalidation, loginvalidation }; // Export the validation functions for use in other files

