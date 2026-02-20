import { API } from "../endpoints";
import axios from "../axios";

export const getAllReviewsAdmin = async (
  page: number = 1,
  size: number = 10,
  search?: string,
) => {
  try {
    const response = await axios.get(API.ADMIN.REVIEW.GET_ALL, {
      params: { page, size, search },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to get reviews",
    );
  }
};

export const getReviewByIdAdmin = async (reviewId: string) => {
  try {
    const response = await axios.get(API.ADMIN.REVIEW.GET_ONE(reviewId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to get review by id",
    );
  }
};

export const getReviewsByUserIdAdmin = async (userId: string) => {
  try {
    const response = await axios.get(API.ADMIN.REVIEW.GET_BY_USER(userId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to get reviews by user",
    );
  }
};

export const getReviewsByHotelIdAdmin = async (hotelId: string) => {
  try {
    const response = await axios.get(API.ADMIN.REVIEW.GET_BY_HOTEL(hotelId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to get reviews by hotel",
    );
  }
};
export const updateReviewAdmin = async (reviewId: string, data: any) => {
  try {
    const response = await axios.put(API.ADMIN.REVIEW.UPDATE(reviewId), data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update review",
    );
  }
};

export const deleteReviewAdmin = async (reviewId: string) => {
  try {
    const response = await axios.delete(API.ADMIN.REVIEW.DELETE(reviewId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete review",
    );
  }
};

export const getReviewAnalyticsAdmin = async () => {
  try {
    const response = await axios.get(API.ADMIN.REVIEW.ANALYTICS_STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch review analytics",
    );
  }
};
