import { Router } from "express";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
import adminRoutes from "./admin.routes";
import superRoutes from "./super.routes";
import sellerRoutes from "../modules/seller/seller.routes";
import productRoutes from "../modules/products/product.routes";
import reviewRoutes from "../modules/reviews/review.routes";
import authRoutes from "../modules/auth/auth.routes";
import orderRoutes from "../modules/orders/order.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import cartRoutes from "../modules/cart/cart.routes";

const router = Router();

router.use(reviewRoutes);
router.use(authRoutes);
router.use("/public", publicRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/super", superRoutes);
router.use(sellerRoutes);
router.use(productRoutes);
router.use(orderRoutes);
router.use(paymentRoutes);
router.use(cartRoutes);

export default router;
