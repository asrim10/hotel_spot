"use server";

import {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getMyBookings,
} from "@/lib/api/booking";

import { revalidatePath } from "next/cache";

export const handleCreateBooking = async (data: FormData) => {
  try {
    const response = await createBooking(data);
    if (response.success) {
      revalidatePath("/bookings");
      return {
        success: true,
        message: "Booking created successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Booking creation failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Create booking action failed",
    };
  }
};

export const handleGetBookingById = async (id: string) => {
  try {
    const response = await getBookingById(id);
    if (response.success) {
      return {
        success: true,
        message: "Booking fetched successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Get booking by id failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get booking by id action failed",
    };
  }
};

export const handleGetMyBookings = async () => {
  try {
    const response = await getMyBookings();
    if (response.success) {
      return {
        success: true,
        message: "Your bookings fetched successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Get my bookings failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get my bookings action failed",
    };
  }
};

export const handleUpdateBooking = async (id: string, data: FormData) => {
  try {
    const response = await updateBooking(id, data);
    if (response.success) {
      revalidatePath("/bookings");
      return {
        success: true,
        message: "Booking updated successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Update booking failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Update booking action failed",
    };
  }
};

export const handleDeleteBooking = async (id: string) => {
  try {
    const response = await deleteBooking(id);
    if (response.success) {
      revalidatePath("/bookings");
      return {
        success: true,
        message: "Booking deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Delete booking failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete booking action failed",
    };
  }
};
