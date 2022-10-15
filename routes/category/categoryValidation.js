const Joi = require("joi");

const createCategoryValidation = {
  body: Joi.object().required().keys({
    name: Joi.string().required(),
  }),
};

const updateCategoryValidation = {
  body: Joi.object().required().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
