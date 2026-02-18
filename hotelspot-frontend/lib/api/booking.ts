import axios from "./axios";
import { API } from "./endpoints";

export const createBooking = async (bookingData: any) => {
  try {
    const response = await axios.post(API.BOOKING.CREATE, bookingData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create booking failed",
    );
  }
};

export const getMyBookings = async () => {
  try {
    const response = await axios.get(API.BOOKING.GET_MY);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get my bookings failed",
    );
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const response = await axios.get(API.BOOKING.GET_ONE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get booking failed",
    );
  }
};

export const updateBooking = async (bookingId: string, bookingData: any) => {
  try {
    const response = await axios.patch(
      API.BOOKING.UPDATE(bookingId),
      bookingData,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update booking failed",
    );
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await axios.delete(API.BOOKING.DELETE(bookingId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete booking failed",
    );
  }
};
