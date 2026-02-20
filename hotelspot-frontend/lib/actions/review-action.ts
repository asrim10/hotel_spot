"use server";

import { ReviewCreateData, ReviewUpdateData } from "@/app/user/review/schema";
import {
  createReview,
  deleteReview,
  getMyReviews,
  getReviewById,
  getReviewsByHotel,
  updateReview,
} from "../api/review";

// Create a new review
export const handleCreateReview = async (data: ReviewCreateData) => {
  try {
    const result = await createReview(data);
    if (result.success) {
      return {
        success: true,
        message: "Review created successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to create review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Create review action failed",
    };
  }
};

// Get all reviews for a hotel
export const handleGetReviewsByHotel = async (hotelId: string) => {
  try {
    const result = await getReviewsByHotel(hotelId);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch reviews",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get reviews action failed",
    };
  }
};

// Get all reviews by the logged-in user
export const handleGetMyReviews = async () => {
  try {
    const result = await getMyReviews();
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch your reviews",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get my reviews action failed",
    };
  }
};

// Get review by ID
export const handleGetReviewById = async (id: string) => {
  try {
    const result = await getReviewById(id);
    if (result.success) {
      return { success: true, data: result.data };
    }
    return {
      success: false,
      message: result.message || "Failed to fetch review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get review action failed",
    };
  }
};

// Update review
export const handleUpdateReview = async (
  id: string,
  data: ReviewUpdateData,
) => {
  try {
    const result = await updateReview(id, data);
    if (result.success) {
      return {
        success: true,
        message: "Review updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Failed to update review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Update review action failed",
    };
  }
};

// Delete review
export const handleDeleteReview = async (id: string) => {
  try {
    const result = await deleteReview(id);
    if (result.success) {
      return { success: true, message: "Review deleted successfully" };
    }
    return {
      success: false,
      message: result.message || "Failed to delete review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete review action failed",
    };
  }
};
