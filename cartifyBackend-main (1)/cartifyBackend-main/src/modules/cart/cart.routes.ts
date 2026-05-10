import { Router } from "express";
import { cartController } from "./cart.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/cart",
  authenticate,
  authorize("USER"),
  cartController.add
);

router.get(
  "/cart",  
  authenticate,
  authorize("USER"),
  cartController.get
);

router.patch(
  "/cart/:productId",
  authenticate,
  authorize("USER"),
  cartController.update
);

router.delete(
  "/cart/:productId",
  authenticate,
  authorize("USER"),
  cartController.remove
);

export default router;
