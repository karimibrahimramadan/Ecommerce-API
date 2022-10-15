const Joi = require("joi");

const createReviewValidation = {
  body: Joi.object().required().keys({
    review: Joi.string().required(),
  }),
};

const updateReviewValidation = {
  body: Joi.object().required().keys({
    review: Joi.string().required(),
  }),
};

module.exports = {
  createReviewValidation,
  updateReviewValidation,
};
