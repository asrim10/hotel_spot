"use server";

import {
  createBookingAdmin,
  getAllBookingsAdmin,
  getBookingByIdAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
  updateBookingStatusAdmin,
  updatePaymentStatusAdmin,
  confirmBookingAdmin,
  cancelBookingAdmin,
  checkInBookingAdmin,
  checkOutBookingAdmin,
  getBookingStatsAdmin,
  getBookingsByUserIdAdmin,
  getBookingsByStatusAdmin,
  getBookingsByPaymentStatusAdmin,
  getBookingsByDateRangeAdmin,
  getUpcomingCheckInsAdmin,
  getUpcomingCheckOutsAdmin,
} from "@/lib/api/admin/booking";

import { revalidatePath } from "next/cache";

// CRUD ACTIONS
export const handleCreateBookingAdmin = async (data: any) => {
  try {
    const response = await createBookingAdmin(data);

    if (response.success) {
      revalidatePath("/admin/bookings");
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetAllBookingsAdmin = async () => {
  try {
    const response = await getAllBookingsAdmin();
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetBookingByIdAdmin = async (bookingId: string) => {
  try {
    const response = await getBookingByIdAdmin(bookingId);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleUpdateBookingAdmin = async (
  bookingId: string,
  data: any,
) => {
  try {
    const response = await updateBookingAdmin(bookingId, data);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleDeleteBookingAdmin = async (bookingId: string) => {
  try {
    const response = await deleteBookingAdmin(bookingId);

    if (response.success) {
      revalidatePath("/admin/bookings");
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// STATUS MANAGEMENT ACTIONS
export const handleUpdateBookingStatusAdmin = async (
  bookingId: string,
  status: string,
) => {
  try {
    const response = await updateBookingStatusAdmin(bookingId, status);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleUpdatePaymentStatusAdmin = async (
  bookingId: string,
  paymentStatus: string,
) => {
  try {
    const response = await updatePaymentStatusAdmin(bookingId, paymentStatus);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleConfirmBookingAdmin = async (bookingId: string) => {
  try {
    const response = await confirmBookingAdmin(bookingId);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleCancelBookingAdmin = async (bookingId: string) => {
  try {
    const response = await cancelBookingAdmin(bookingId);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleCheckInBookingAdmin = async (bookingId: string) => {
  try {
    const response = await checkInBookingAdmin(bookingId);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleCheckOutBookingAdmin = async (bookingId: string) => {
  try {
    const response = await checkOutBookingAdmin(bookingId);

    if (response.success) {
      revalidatePath("/admin/bookings");
      revalidatePath(`/admin/bookings/${bookingId}`);
    }

    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// FILTER / QUERY ACTIONS
export const handleGetBookingStatsAdmin = async () => {
  try {
    const response = await getBookingStatsAdmin();
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetBookingsByUserIdAdmin = async (userId: string) => {
  try {
    const response = await getBookingsByUserIdAdmin(userId);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetBookingsByStatusAdmin = async (status: string) => {
  try {
    const response = await getBookingsByStatusAdmin(status);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetBookingsByPaymentStatusAdmin = async (
  paymentStatus: string,
) => {
  try {
    const response = await getBookingsByPaymentStatusAdmin(paymentStatus);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetBookingsByDateRangeAdmin = async (
  startDate: string,
  endDate: string,
) => {
  try {
    const response = await getBookingsByDateRangeAdmin(startDate, endDate);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetUpcomingCheckInsAdmin = async () => {
  try {
    const response = await getUpcomingCheckInsAdmin();
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const handleGetUpcomingCheckOutsAdmin = async () => {
  try {
    const response = await getUpcomingCheckOutsAdmin();
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
