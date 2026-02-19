import axios from "../axios";
import { API } from "../endpoints";

// ADMIN BOOKING CRUD
export const createBookingAdmin = async (bookingData: any) => {
  try {
    const response = await axios.post(API.ADMIN.BOOKING.CREATE, bookingData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin create booking failed",
    );
  }
};

export const getAllBookingsAdmin = async () => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GET_ALL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get all bookings failed",
    );
  }
};

export const getBookingByIdAdmin = async (bookingId: string) => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GET_ONE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get booking failed",
    );
  }
};

export const updateBookingAdmin = async (
  bookingId: string,
  bookingData: any,
) => {
  try {
    const response = await axios.patch(
      API.ADMIN.BOOKING.UPDATE(bookingId),
      bookingData,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin update booking failed",
    );
  }
};

export const deleteBookingAdmin = async (bookingId: string) => {
  try {
    const response = await axios.delete(API.ADMIN.BOOKING.DELETE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin delete booking failed",
    );
  }
};

// ADMIN BOOKING STATUS MANAGEMENT
export const updateBookingStatusAdmin = async (
  bookingId: string,
  status: string,
) => {
  try {
    const response = await axios.patch(
      API.ADMIN.BOOKING.UPDATE_STATUS(bookingId),
      {
        status,
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin update booking status failed",
    );
  }
};

export const updatePaymentStatusAdmin = async (
  bookingId: string,
  paymentStatus: string,
) => {
  try {
    const response = await axios.patch(
      API.ADMIN.BOOKING.UPDATE_PAYMENT_STATUS(bookingId),
      { paymentStatus },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin update payment status failed",
    );
  }
};

export const confirmBookingAdmin = async (bookingId: string) => {
  try {
    const response = await axios.post(API.ADMIN.BOOKING.CONFIRM(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin confirm booking failed",
    );
  }
};

export const cancelBookingAdmin = async (bookingId: string) => {
  try {
    const response = await axios.post(API.ADMIN.BOOKING.CANCEL(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin cancel booking failed",
    );
  }
};

export const checkInBookingAdmin = async (bookingId: string) => {
  try {
    const response = await axios.post(API.ADMIN.BOOKING.CHECK_IN(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Admin check-in failed",
    );
  }
};

export const checkOutBookingAdmin = async (bookingId: string) => {
  try {
    const response = await axios.post(API.ADMIN.BOOKING.CHECK_OUT(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin check-out failed",
    );
  }
};

// ADMIN BOOKING FILTER / QUERIES
export const getBookingStatsAdmin = async () => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.ANALYTICS_STATS);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin booking stats failed",
    );
  }
};

export const getBookingsByUserIdAdmin = async (userId: string) => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GET_BY_USER(userId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get bookings by user failed",
    );
  }
};

export const getBookingsByStatusAdmin = async (status: string) => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.GET_BY_STATUS(status));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get bookings by status failed",
    );
  }
};

export const getBookingsByPaymentStatusAdmin = async (
  paymentStatus: string,
) => {
  try {
    const response = await axios.get(
      API.ADMIN.BOOKING.GET_BY_PAYMENT_STATUS(paymentStatus),
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get bookings by payment status failed",
    );
  }
};

export const getBookingsByDateRangeAdmin = async (
  startDate: string,
  endDate: string,
) => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.FILTER_DATE_RANGE, {
      params: { startDate, endDate },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get bookings by date range failed",
    );
  }
};

export const getUpcomingCheckInsAdmin = async () => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.UPCOMING_CHECK_INS);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get upcoming check-ins failed",
    );
  }
};

export const getUpcomingCheckOutsAdmin = async () => {
  try {
    const response = await axios.get(API.ADMIN.BOOKING.UPCOMING_CHECK_OUTS);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Admin get upcoming check-outs failed",
    );
  }
};
