const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/appError");

const roles = {
  admin: "Admin",
  user: "User",
  seller: "Seller",
};

const auth = (accessRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.access_token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        return next(new AppError("Token is invalid or has expired", 400));
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      if (accessRoles.includes(user.role)) {
        req.user = user;
        next();
      } else {
        return next(new AppError("Not authorized!", 401));
      }
    } catch (error) {
      return next(new AppError("You must be logged in!", 500));
    }
  };
};

module.exports = {
  auth,
  roles,
};
