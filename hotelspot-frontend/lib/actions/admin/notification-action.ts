"use server";

import {
  adminGetAllNotifications,
  adminGetNotificationsByUser,
  adminDeleteNotification,
  adminDeleteAllByUser,
} from "@/lib/api/admin/notification";

export const handleAdminGetAllNotifications = async () => {
  try {
    const response = await adminGetAllNotifications();
    if (response.success) {
      return {
        success: true,
        message: "Notifications fetched successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to fetch notifications",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get all notifications action failed",
    };
  }
};

export const handleAdminGetNotificationsByUser = async (userId: string) => {
  try {
    const response = await adminGetNotificationsByUser(userId);
    if (response.success) {
      return {
        success: true,
        message: "User notifications fetched successfully",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to fetch user notifications",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get user notifications action failed",
    };
  }
};

export const handleAdminDeleteNotification = async (id: string) => {
  try {
    const response = await adminDeleteNotification(id);
    if (response.success) {
      return {
        success: true,
        message: "Notification deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Failed to delete notification",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete notification action failed",
    };
  }
};

export const handleAdminDeleteAllByUser = async (userId: string) => {
  try {
    const response = await adminDeleteAllByUser(userId);
    if (response.success) {
      return {
        success: true,
        message: "All notifications deleted successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Failed to delete all notifications",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Delete all notifications action failed",
    };
  }
};
