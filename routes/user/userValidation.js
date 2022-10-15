const Joi = require("joi");

const updateMeValidation = {
  body: Joi.object().required().keys({
    name: Joi.string(),
    phone: Joi.string(),
  }),
};

const updateUserValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      role: Joi.string().valid("User", "Admin", "Seller"),
    }),
};

module.exports = {
  updateMeValidation,
  updateUserValidation,
};
