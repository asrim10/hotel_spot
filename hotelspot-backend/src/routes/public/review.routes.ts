import { Router } from "express";
import { PublicReviewController } from "../../controllers/public/review.controller";

const router = Router();
const publicReviewController = new PublicReviewController();
router.get("/", (req, res) => {
  publicReviewController.getPublicReviews(req, res);
});

export default router;
