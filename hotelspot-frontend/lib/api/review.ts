import axios from "./axios";
import { API } from "./endpoints";

export const createReview = async (data: any) => {
  try {
    const response = await axios.post(API.REVIEW.CREATE, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create review",
    );
  }
};

export const getMyReviews = async () => {
  try {
    const response = await axios.get(API.REVIEW.GET_MY);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch your reviews",
    );
  }
};

export const getReviewsByHotel = async (hotelId: string) => {
  try {
    const response = await axios.get(API.REVIEW.GET_BY_HOTEL(hotelId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch hotel reviews",
    );
  }
};

export const getReviewById = async (reviewId: string) => {
  try {
    const response = await axios.get(API.REVIEW.GET_ONE(reviewId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch review",
    );
  }
};

export const updateReview = async (reviewId: string, data: any) => {
  try {
    const response = await axios.put(API.REVIEW.UPDATE(reviewId), data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update review",
    );
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    const response = await axios.delete(API.REVIEW.DELETE(reviewId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to delete review",
    );
  }
};
