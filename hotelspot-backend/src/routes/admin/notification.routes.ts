import { Router } from "express";
import { AdminNotificationController } from "../../controllers/admin/notification.controller";
import {
  adminMiddleware,
  authorizedMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const adminNotificationController = new AdminNotificationController();

router.use(authorizedMiddleware);
router.use(adminMiddleware);

router.get("/", (req, res) =>
  adminNotificationController.getAllNotifications(req, res),
);

router.get("/:id", (req, res) =>
  adminNotificationController.getNotificationById(req, res),
);

router.get("/user/:userId", (req, res) =>
  adminNotificationController.getNotificationsByUserId(req, res),
);

router.delete("/user/:userId", (req, res) =>
  adminNotificationController.deleteAllByUserId(req, res),
);

router.delete("/:id", (req, res) =>
  adminNotificationController.deleteNotification(req, res),
);

export default router;
