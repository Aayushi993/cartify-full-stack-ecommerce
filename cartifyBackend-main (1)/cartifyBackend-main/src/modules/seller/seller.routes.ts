import { Router } from "express";
import { sellerController } from "./seller.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

// USER applies
router.post(
  "/seller/apply",
  authenticate,
  authorize("USER", "ADMIN"),
  sellerController.apply,
);

// USER checks status
router.get(
  "/seller/status",
  authenticate,
  authorize("USER", "ADMIN"),
  sellerController.myStatus,
);

export default router;
