const Joi = require("joi");

const signupValidation = {
  body: Joi.object()
    .required()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      cPassword: Joi.valid(Joi.ref("password")).required(),
    }),
};

const loginValidation = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const forgotPasswordValidation = {
  body: Joi.object().required().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPasswordValidation = {
  body: Joi.object()
    .required()
    .keys({
      password: Joi.string().required(),
      cPassword: Joi.valid(Joi.ref("password")).required(),
    }),
};

const updatePasswordValidation = {
  body: Joi.object()
    .required()
    .keys({
      password: Joi.string().required(),
      newPassword: Joi.string().required(),
      cNewPassword: Joi.valid(Joi.ref("newPassword")).required(),
    }),
};

module.exports = {
  signupValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updatePasswordValidation,
};
