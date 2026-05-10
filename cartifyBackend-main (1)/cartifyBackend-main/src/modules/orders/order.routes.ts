import { Router } from "express";
import { orderController } from "./order.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/orders",
  authenticate,
  authorize("USER", "ADMIN", "SUPER_ADMIN"),
  orderController.checkout
);

router.get(
  "/orders",
  authenticate,
  authorize("USER", "ADMIN", "SUPER_ADMIN"),
  orderController.myOrders
);

router.patch(
  "/orders/:orderId/status",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  orderController.updateStatus
);

router.get(
  "/orders/seller",
  authenticate,
  authorize("ADMIN"),
  orderController.sellerOrders
);

export default router;