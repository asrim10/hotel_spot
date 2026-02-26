"use server";

import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/api/notification";

export const handleGetNotifications = async () => {
  try {
    const response = await getNotifications();

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
      message: error.message || "Get notifications action failed",
    };
  }
};

export const handleGetUnreadCount = async () => {
  try {
    const response = await getUnreadCount();

    if (response.success) {
      return {
        success: true,
        message: "Unread count fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch unread count",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get unread count action failed",
    };
  }
};

export const handleMarkAsRead = async (id: string) => {
  try {
    const response = await markAsRead(id);

    if (response.success) {
      return {
        success: true,
        message: "Notification marked as read",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to mark as read",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Mark as read action failed",
    };
  }
};

export const handleMarkAllAsRead = async () => {
  try {
    const response = await markAllAsRead();

    if (response.success) {
      return {
        success: true,
        message: "All notifications marked as read",
      };
    }

    return {
      success: false,
      message: response.message || "Failed to mark all as read",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Mark all as read action failed",
    };
  }
};

export const handleDeleteNotification = async (id: string) => {
  try {
    const response = await deleteNotification(id);

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
