import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ReviewService } from "../services/review.service";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";

const reviewService = new ReviewService();

export class ReviewController {
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateReviewDTO = req.body;
      const newReview = await reviewService.createReview(data);

      return res.status(201).json({
        success: true,
        data: newReview,
        message: "Review created successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }

      const review = await reviewService.getReviewById(reviewId);

      return res.status(200).json({
        success: true,
        data: review,
        message: "Review retrieved successfully",
      });
    } catch (error: any) {
      if (error.message === "Review not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getReviewsByHotelId(req: Request, res: Response, next: NextFunction) {
    try {
      const hotelId = req.params.hotelId;

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid hotel ID",
        });
      }

      const reviews = await reviewService.getReviewsByHotelId(hotelId);

      return res.status(200).json({
        success: true,
        data: reviews,
        message: "Reviews retrieved successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getReviewsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      const reviews = await reviewService.getReviewsByUserId(userId);

      return res.status(200).json({
        success: true,
        data: reviews,
        message: "User reviews retrieved successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;
      const data: UpdateReviewDTO = req.body;

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }

      const updatedReview = await reviewService.updateReview(reviewId, data);

      return res.status(200).json({
        success: true,
        data: updatedReview,
        message: "Review updated successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review ID",
        });
      }

      const deleted = await reviewService.deleteReview(reviewId);

      return res.status(200).json({
        success: true,
        data: deleted,
        message: "Review deleted successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
