import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const adminUserController = new AdminUserController();

router.use(authorizedMiddleware, adminOnlyMiddleware);
router.post("/", adminUserController.createUser);
router.get("/", adminUserController.getAllUsers);
router.get("/:id", adminUserController.getOneUser);

export default router;
