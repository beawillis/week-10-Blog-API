const joi = require('joi');

const createArticleValidation = (data) => {
  const schema = joi.object({
    title: joi.string().min(3).max(100).required(),
    content: joi.string().min(20).required(),
  });

  return schema.validate(data);
};

const updateArticleValidation = (data) => {
  const schema = joi.object({
    title: joi.string().min(3).max(100),
    content: joi.string().min(20),
  });

  return schema.validate(data);
};

module.exports = { createArticleValidation, updateArticleValidation };