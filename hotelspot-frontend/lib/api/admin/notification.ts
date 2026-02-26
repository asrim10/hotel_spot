import axios from "../axios";
import { API } from "../endpoints";

export const adminGetAllNotifications = async () => {
  try {
    const response = await axios.get(API.ADMIN.NOTIFICATION.GET_ALL);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get all notifications failed",
    );
  }
};

export const adminGetNotificationsByUser = async (userId: string) => {
  try {
    const response = await axios.get(
      API.ADMIN.NOTIFICATION.GET_BY_USER(userId),
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get user notifications failed",
    );
  }
};

export const adminDeleteNotification = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.NOTIFICATION.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Delete notification failed",
    );
  }
};

export const adminDeleteAllByUser = async (userId: string) => {
  try {
    const response = await axios.delete(
      API.ADMIN.NOTIFICATION.DELETE_ALL_BY_USER(userId),
    );
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Delete all notifications failed",
    );
  }
};
