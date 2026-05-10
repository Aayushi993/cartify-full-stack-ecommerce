import { Router } from "express";
import { productController } from "./product.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { upload } from "../../utils/upload";

const router = Router();

// public
router.get("/products", productController.list);
router.get(
  "/products/my",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  productController.myProducts,
);

router.get("/products/:id", productController.getSingle);
// admin only
router.post(
  "/products",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.array("images"),
  productController.create,
);

router.patch(
  "/products/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.array("images"), // 🔥🔥 ADD THIS
  productController.update,
);
router.delete(
  "/products/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  productController.remove,
);

export default router;
