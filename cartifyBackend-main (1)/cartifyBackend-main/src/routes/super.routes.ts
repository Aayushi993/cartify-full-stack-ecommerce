import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { superAdminController } from "../modules/users/user.admin.controller";
import { sellerAdminController } from "../modules/seller/seller.admin.controller";

const router = Router();

router.use(authenticate, authorize("SUPER_ADMIN"));

router.get("/users", superAdminController.listUsers);
router.patch("/users/role", superAdminController.updateRole);
router.patch("/users/block/:userId", superAdminController.toggleBlock);

router.get("/seller-requests", sellerAdminController.listRequests);
router.patch("/seller-requests/:id", sellerAdminController.updateStatus);

export default router;
