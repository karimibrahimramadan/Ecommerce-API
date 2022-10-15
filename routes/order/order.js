const router = require("express").Router();
const orderController = require("../../controllers/orderController");
const { auth, roles } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./orderValidation");

// Create new order
router.post(
  "/",
  validation(validators.createOrderValidation),
  auth(roles.user),
  orderController.createOrder
);

// Update order
router.patch(
  "/:orderId",
  validation(validators.createOrderValidation),
  auth([roles.admin, roles.seller]),
  orderController.updateOrder
);

// Delete order
router.delete("/:orderId", auth(roles.admin), orderController.deleteOrder);

// Get order
router.get("/:orderId", auth(roles.admin), orderController.getOrder);

// Get all orders
router.get("/", auth(roles.admin), orderController.getAllOrders);

// Get all user's orders
router.get("/:userId", auth(roles.admin), orderController.getAllUsersOrders);

// Get logged in user's orders
router.get("/me", auth(roles.user), orderController.getMyOrders);

// Process order
router.patch(
  "/:orderId/process",
  validation(validators.processOrderValidation),
  auth([roles.admin, roles.seller]),
  orderController.processOrder
);

module.exports = router;
