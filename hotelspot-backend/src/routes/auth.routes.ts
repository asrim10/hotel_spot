import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

let authController = new AuthController();
const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/users/:id", authController.update);
router.delete("/users/:id", authController.delete);

export default router;
