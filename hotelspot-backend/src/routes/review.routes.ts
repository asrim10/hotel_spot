import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const reviewController = new ReviewController();

router.post("/", authorizedMiddleware, reviewController.createReview);
router.get("/hotel/:hotelId", reviewController.getReviewsByHotelId);
router.get("/me", authorizedMiddleware, reviewController.getMyReviews);
router.get("/:id", authorizedMiddleware, reviewController.getReviewById);
router.put("/:id", authorizedMiddleware, reviewController.updateReview);
router.delete("/:id", authorizedMiddleware, reviewController.deleteReview);

export default router;
