import { Router } from "express";
import { productController } from "../modules/products/product.controller";
import { authController } from "../modules/auth/auth.controller";

const router = Router();

// AUTH (login / signup)
router.post("/auth", authController.signupOrLogin);

// PUBLIC PRODUCTS
router.get("/products", productController.list);

export default router;
