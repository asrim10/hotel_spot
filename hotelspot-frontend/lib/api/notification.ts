import axios from "./axios";
import { API } from "./endpoints";

export const getNotifications = async () => {
  try {
    const response = await axios.get(API.NOTIFICATION.GET_ALL);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get notifications failed",
    );
  }
};

export const getUnreadCount = async () => {
  try {
    const response = await axios.get(API.NOTIFICATION.UNREAD_COUNT);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get unread count failed",
    );
  }
};

export const markAsRead = async (id: string) => {
  try {
    const response = await axios.patch(API.NOTIFICATION.MARK_AS_READ(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Mark as read failed",
    );
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await axios.patch(API.NOTIFICATION.MARK_ALL_READ);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Mark all as read failed",
    );
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const response = await axios.delete(API.NOTIFICATION.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Delete notification failed",
    );
  }
};
