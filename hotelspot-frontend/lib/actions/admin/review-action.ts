"use server";

import {
  deleteReviewAdmin,
  getAllReviewsAdmin,
  getReviewAnalyticsAdmin,
  getReviewByIdAdmin,
  getReviewsByHotelIdAdmin,
  getReviewsByUserIdAdmin,
  updateReviewAdmin,
} from "@/lib/api/admin/review";
import { revalidatePath } from "next/cache";

export const handleUpdateReview = async (id: string, data: FormData) => {
  try {
    const response = await updateReviewAdmin(id, data);
    if (response.success) {
      revalidatePath("/admin/reviews");
      return {
        success: true,
        message: "Review updated successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Update review failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Update review action failed",
    };
  }
};

export const handleDeleteReview = async (id: string) => {
  try {
    const response = await deleteReviewAdmin(id);
    if (response.success) {
      revalidatePath("/admin/reviews");
      return {
        success: true,
        message: "Review deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Delete review failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete review action failed",
    };
  }
};

export const handleGetAllReviews = async (
  page: string,
  size: string,
  search?: string,
) => {
  try {
    const currentPage = parseInt(page) || 1;
    const currentSize = parseInt(size) || 10;

    const response = await getAllReviewsAdmin(currentPage, currentSize, search);
    if (response.success) {
      return {
        success: true,
        message: "Reviews retrieved successfully",
        data: response.data,
        pagination: response.pagination,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to retrieve reviews",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get all reviews action failed",
    };
  }
};

export const handleGetReviewById = async (id: string) => {
  try {
    const response = await getReviewByIdAdmin(id);
    if (response.success) {
      return {
        success: true,
        message: "Review retrieved successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to retrieve review",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get review by ID action failed",
    };
  }
};

export const handleGetReviewsByHotelId = async (hotelId: string) => {
  try {
    const response = await getReviewsByHotelIdAdmin(hotelId);
    if (response.success) {
      return {
        success: true,
        message: "Hotel reviews retrieved successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to retrieve hotel reviews",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get reviews by hotel ID action failed",
    };
  }
};

export const handleGetReviewsByUserId = async (userId: string) => {
  try {
    const response = await getReviewsByUserIdAdmin(userId);
    if (response.success) {
      return {
        success: true,
        message: "User reviews retrieved successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to retrieve user reviews",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get reviews by user ID action failed",
    };
  }
};

export const handleGetReviewAnalytics = async () => {
  try {
    const response = await getReviewAnalyticsAdmin();
    if (response.success) {
      return {
        success: true,
        message: "Review analytics retrieved successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to retrieve review analytics",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get review analytics action failed",
    };
  }
};
