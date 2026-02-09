"use server";

import {
  createHotel,
  getAllHotel,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "@/lib/api/admin/hotel";
import { revalidatePath } from "next/cache";

export const handleCreateHotel = async (data: FormData) => {
  try {
    const response = await createHotel(data);
    if (response.success) {
      revalidatePath("/admin/hotels");
      return {
        success: true,
        message: "Hotel created successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Hotel creation failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Create hotel action failed",
    };
  }
};

export const handleGetAllHotels = async (
  page: string,
  size: string,
  search?: string,
) => {
  try {
    const currentPage = parseInt(page) || 1;
    const currentSize = parseInt(size) || 10;

    const response = await getAllHotel(currentPage, currentSize, search);
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
      message: response.message || "Get all hotels failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get all hotels action failed",
    };
  }
};

export const handleGetOneHotel = async (id: string) => {
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
      message: response.message || "Get hotel by id failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get hotel by id action failed",
    };
  }
};

export const handleUpdateHotel = async (id: string, data: FormData) => {
  try {
    const response = await updateHotel(id, data);
    if (response.success) {
      revalidatePath("/admin/hotels");
      return {
        success: true,
        message: "Hotel updated successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Update hotel failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Update hotel action failed",
    };
  }
};

export const handleDeleteHotel = async (id: string) => {
  try {
    const response = await deleteHotel(id);
    if (response.success) {
      revalidatePath("/admin/hotels");
      return {
        success: true,
        message: "Hotel deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Delete hotel failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete hotel action failed",
    };
  }
};
