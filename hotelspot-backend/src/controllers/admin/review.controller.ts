import { Request, Response } from "express";
import { AdminReviewService } from "../../services/admin/review.service";
import { UpdateReviewDTO } from "../../dtos/review.dto";
import { HttpError } from "../../errors/http-error";

const adminReviewService = new AdminReviewService();

export class AdminReviewController {
  async getAllReviews(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = req.query.search as string;

      const result = await adminReviewService.getAllReviews(page, size, search);

      res.status(200).json({
        success: true,
        message: "Reviews retrieved successfully",
        data: result.reviews,
        pagination: {
          page: result.page,
          size: result.size,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve reviews",
      });
    }
  }

  async getReviewById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const review = await adminReviewService.getReviewById(id);

      res.status(200).json({
        success: true,
        message: "Review retrieved successfully",
        data: review,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve review",
      });
    }
  }

  async getReviewsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const reviews = await adminReviewService.getReviewsByUserId(userId);

      res.status(200).json({
        success: true,
        message: "User reviews retrieved successfully",
        data: reviews,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve user reviews",
      });
    }
  }

  async getReviewsByHotelId(req: Request, res: Response) {
    try {
      const { hotelId } = req.params;
      const reviews = await adminReviewService.getReviewsByHotelId(hotelId);

      res.status(200).json({
        success: true,
        message: "Hotel reviews retrieved successfully",
        data: reviews,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve hotel reviews",
      });
    }
  }

  async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateReviewDTO = req.body;

      const updatedReview = await adminReviewService.updateReview(
        id,
        updateData,
      );

      res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: updatedReview,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update review",
      });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await adminReviewService.deleteReview(id);

      res.status(200).json({
        success: true,
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to delete review",
      });
    }
  }

  async getReviewStats(req: Request, res: Response) {
    try {
      const stats = await adminReviewService.getReviewStats();

      res.status(200).json({
        success: true,
        message: "Review statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve review statistics",
      });
    }
  }
}
