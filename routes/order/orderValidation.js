const Joi = require("joi");

const createOrderValidation = {
  body: Joi.object()
    .required()
    .keys({
      shippingInfo: Joi.object().keys({
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
        phoneNumber: Joi.string().required(),
      }),
      paymentInfo: Joi.object().keys({
        id: Joi.string().required(),
        status: Joi.string().required(),
      }),
      itemsPrice: Joi.number().required(),
      shippingPrice: Joi.number().required(),
      taxPrice: Joi.number().required(),
      orderStatus: Joi.string(),
      orderItems: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          product: Joi.string().hex().length(24).required(),
          quantity: Joi.number().required(),
          price: Joi.number().required(),
        })
      ),
    }),
};

const updateOrderValidation = {
  body: Joi.object()
    .required()
    .keys({
      shippingInfo: Joi.object().keys({
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
        postalCode: Joi.string(),
        phoneNumber: Joi.string(),
      }),
      paymentInfo: Joi.object().keys({}),
      itemsPrice: Joi.number(),
      shippingPrice: Joi.number(),
      taxPrice: Joi.number(),
      orderStatus: Joi.string(),
      orderItems: Joi.array().items(
        Joi.object().keys({
          name: Joi.string(),
          product: Joi.string().hex().length(24),
          quantity: Joi.number(),
          price: Joi.number(),
        })
      ),
    }),
};

const processOrderValidation = {
  body: Joi.object().required().keys({
    orderStatus: Joi.string().required(),
  }),
};

module.exports = {
  createOrderValidation,
  updateOrderValidation,
  processOrderValidation,
};
