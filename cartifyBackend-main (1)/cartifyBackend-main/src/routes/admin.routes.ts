import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { productController } from "../modules/products/product.controller";
import { orderController } from "../modules/orders/order.controller";
import { upload } from "../utils/upload";

const router = Router();

router.use(authenticate, authorize("ADMIN", "SUPER_ADMIN"));

router.post("/products", upload.array("images"), productController.create);
router.patch("/orders/:orderId/status", orderController.updateStatus);

export default router;
