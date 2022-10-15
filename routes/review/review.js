const router = require("express").Router({ mergeParams: true });
const reviewController = require("../../controllers/reviewController");
const { auth, roles } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./reviewValidation");

// Create new review
router.post(
  "/",
  validation(validators.createReviewValidation),
  auth(roles.user),
  reviewController.createReview
);

// Update review
router.patch(
  "/:reviewId",
  validation(validators.updateReviewValidation),
  auth([roles.user, roles.admin]),
  reviewController.updateReview
);

// Delete review
router.delete(
  "/:reviewId",
  auth([roles.user, roles.admin]),
  reviewController.deleteReview
);

// Get review
router.get("/:reviewId", reviewController.getReview);

// Get all reviews on a product
router.get("/", reviewController.getAllReviews);

module.exports = router;
