import { Router } from "express";
import { authorizedMiddleware } from "../../middlewares/authorized.middleware";
import { AdminReviewController } from "../../controllers/admin/review.controller";

const router = Router();
const adminReviewController = new AdminReviewController();

router.get("/", authorizedMiddleware, (req, res) =>
  adminReviewController.getAllReviews(req, res),
);
router.get("/:id", authorizedMiddleware, (req, res) =>
  adminReviewController.getReviewById(req, res),
);
router.get("/user/:userId", authorizedMiddleware, (req, res) =>
  adminReviewController.getReviewsByUserId(req, res),
);
router.get("/hotel/:hotelId", authorizedMiddleware, (req, res) =>
  adminReviewController.getReviewsByHotelId(req, res),
);
router.put("/:id", authorizedMiddleware, (req, res) =>
  adminReviewController.updateReview(req, res),
);
router.delete("/:id", authorizedMiddleware, (req, res) =>
  adminReviewController.deleteReview(req, res),
);
router.get("/stats/all", authorizedMiddleware, (req, res) =>
  adminReviewController.getReviewStats(req, res),
);

export default router;
