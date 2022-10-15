const Joi = require("joi");

const createSubcategoryValidation = {
  body: Joi.object().required().keys({
    name: Joi.string().required(),
  }),
};

const updateSubcategoryValidation = {
  body: Joi.object().required().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  createSubcategoryValidation,
  updateSubcategoryValidation,
};
