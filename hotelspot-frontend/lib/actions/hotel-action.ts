"use server";

import { getAllHotels, getHotelById } from "@/lib/api/hotel";

export const handleGetAllHotels = async (
  page: string = "1",
  size: string = "20",
  search?: string,
) => {
  try {
    const currentPage = parseInt(page) || 1;
    const currentSize = parseInt(size) || 20;

    const response = await getAllHotels(currentPage, currentSize, search);

    if (response.success) {
      return {
        success: true,
        message: "Hotels fetched successfully",
        data: response.data,
        pagination: response.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch hotels",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get hotels action failed",
    };
  }
};

export const handleGetHotelById = async (id: string) => {
  try {
    const response = await getHotelById(id);

    if (response.success) {
      return {
        success: true,
        message: "Hotel fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch hotel",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get hotel by id action failed",
    };
  }
};
