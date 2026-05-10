import { Router } from "express";
import { reviewController } from "./review.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.post(
  "/products/:productId/reviews",
  authenticate,
  authorize("USER"),
  reviewController.add,
);

router.get("/products/:productId/reviews", reviewController.list);

router.patch(
  "/reviews/:reviewId",
  authenticate,
  authorize("USER"),
  reviewController.update,
);

router.put(
  "/reviews/:reviewId",
  authenticate,
  authorize("USER"),
  reviewController.update,
);

router.delete(
  "/reviews/:reviewId",
  authenticate,
  authorize("USER"),
  reviewController.remove,
);

export default router;