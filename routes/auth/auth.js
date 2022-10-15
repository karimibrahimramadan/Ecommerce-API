const router = require("express").Router();
const authController = require("../../controllers/authController");
const { auth, roles } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./authValidation");

// Register new user
router.post(
  "/signup",
  validation(validators.signupValidation),
  authController.signup
);

// Confirm email
router.get("/confirm-email/:token", authController.confirmEmail);

// Login user
router.post(
  "/login",
  validation(validators.loginValidation),
  authController.login
);

// Forgot password
router.patch(
  "/forgotpassword",
  validation(validators.forgotPasswordValidation),
  authController.forgotPassword
);

// Reset password
router.patch(
  "/resetpassword/:token",
  validation(validators.resetPasswordValidation),
  authController.resetPassword
);

// Update password
router.patch(
  "/me/updatepassword",
  validation(validators.updatePasswordValidation),
  auth([roles.admin, roles.user, roles.seller]),
  authController.updatePassword
);

// Logout user
router.get(
  "/logout",
  auth([roles.admin, roles.seller, roles.user]),
  authController.logout
);

module.exports = router;
