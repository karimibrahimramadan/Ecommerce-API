const AppError = require("../utils/appError");

const dataMethods = ["query", "body", "params", "headers", "file"];

const validation = (schema) => {
  return (req, res, next) => {
    try {
      const validationErrArr = [];
      dataMethods.forEach((key) => {
        if (schema[key]) {
          const validationResult = schema[key].validate(req[key], {
            abortEarly: false,
          });
          if (validationResult.error) {
            validationErrArr.push(validationResult.error.details);
          }
        }
      });
      if (validationErrArr.length) {
        return res.status(400).json({
          status: "Fail",
          error: validationErrArr,
        });
      } else {
        next();
      }
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  };
};

module.exports = validation;
