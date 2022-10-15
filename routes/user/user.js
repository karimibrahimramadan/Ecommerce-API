const router = require("express").Router();
const userController = require("../../controllers/userController");
const { auth, roles } = require("../../middlewares/auth");
const multerErrorHandler = require("../../middlewares/multerErrorHandler");
const validation = require("../../middlewares/validation");
const validators = require("./userValidation");
const { upload, fileValidation } = require("../../utils/multer");

// Update user
router.patch(
  "/me/update",
  validation(validators.updateMeValidation),
  auth([roles.user, roles.seller, roles.admin]),
  userController.updateMe
);

// Upload user's profile picture
router.patch(
  "/me/profile/upload",
  upload("users/profile", fileValidation.image).single("image"),
  multerErrorHandler,
  auth([roles.user, roles.seller, roles.admin]),
  userController.uploadProfilePic
);

// Get logged in user's profile
router.get(
  "/me/profile",
  auth([roles.user, roles.seller, roles.admin]),
  userController.getMe
);

// Delete logged in user's profile
router.get(
  "/me/delete",
  auth([roles.user, roles.seller, roles.admin]),
  userController.deleteMe
);

// !<-------- Admin -------->!

// Get user
router.get("/admin/find/:userId", auth(roles.admin), userController.getUser);

// Get all users
router.get("/admin/find", auth(roles.admin), userController.getAllUsers);

// Update user
router.patch(
  "/admin/find/:userId",
  validation(validators.updateUserValidation),
  auth(roles.admin),
  userController.updateUser
);

// Delete user
router.patch(
  "/admin/delete/:userId",
  auth(roles.admin),
  userController.deleteUser
);

module.exports = router;
