import { Router } from "express";
import cartRoutes from "../modules/cart/cart.routes";
import { orderController } from "../modules/orders/order.controller";
import { paymentController } from "../modules/payments/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

// 🔥 MOUNT CART ROUTES
router.use("/", cartRoutes);

router.post("/checkout", orderController.checkout);
router.get("/orders", orderController.myOrders);

router.post("/payments/create", paymentController.create);
router.post("/payments/confirm", paymentController.confirm);

export default router;
    
