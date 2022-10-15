const Joi = require("joi");

const createProductValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().required(),
      summary: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      priceDiscount: Joi.number(),
      quantity: Joi.number().min(0).required(),
      ratingsAverage: Joi.number().min(0).max(5),
      ratingsQuantity: Joi.number(),
    }),
};

const updateProductValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string(),
      summary: Joi.string(),
      description: Joi.string(),
      price: Joi.number(),
      priceDiscount: Joi.number(),
      quantity: Joi.number().min(0),
      ratingsAverage: Joi.number().min(0).max(5),
      ratingsQuantity: Joi.number(),
    }),
};

module.exports = {
  createProductValidation,
  updateProductValidation,
};
