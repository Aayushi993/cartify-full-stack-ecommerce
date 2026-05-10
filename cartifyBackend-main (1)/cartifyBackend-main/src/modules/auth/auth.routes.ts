import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/auth", authController.signupOrLogin);
router.post("/auth/refresh", authController.refreshToken); // 🔥 ADD THIS
export default router;