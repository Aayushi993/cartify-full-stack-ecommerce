import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/payments/create",
  authenticate,
  authorize("USER", "ADMIN", "SUPER_ADMIN"),
  paymentController.create
);

router.post(
  "/payments/confirm",
  authenticate,
  authorize("USER", "ADMIN", "SUPER_ADMIN"),
  paymentController.confirm
);

export default router;
