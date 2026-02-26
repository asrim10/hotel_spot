import { Request, Response } from "express";
import { AdminReviewService } from "../../services/admin/review.service";

const adminReviewService = new AdminReviewService();

export class PublicReviewController {
  async getPublicReviews(req: Request, res: Response) {
    try {
      const result = await adminReviewService.getAllReviews(1, 10);

      const safeReviews = result.reviews.map((review: any) => {
        const obj = review.toObject ? review.toObject() : review;
        const { email, userId, __v, ...rest } = obj;
        return rest;
      });

      res.status(200).json({
        success: true,
        data: safeReviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve reviews",
      });
    }
  }
}
