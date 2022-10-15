const AppError = require("../utils/appError");

const multerErrorHandler = (err, req, res, next) => {
  if (err) {
    return next(new AppError("Multer error occurred", 400));
  } else {
    next();
  }
};

module.exports = multerErrorHandler;
