const authRouter = require("./auth/auth");
const categoryRouter = require("./category/category");
const orderRouter = require("./order/order");
const productRouter = require("./product/product");
const reviewRouter = require("./review/review");
const subCategoryRouter = require("./subCategory/subCategory");
const userRouter = require("./user/user");

module.exports = {
  authRouter,
  categoryRouter,
  orderRouter,
  productRouter,
  reviewRouter,
  subCategoryRouter,
  userRouter,
};
