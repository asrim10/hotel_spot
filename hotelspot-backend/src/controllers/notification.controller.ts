import { Request, Response } from "express";
import mongoose from "mongoose";
import { NotificationService } from "../services/notification.service";

const notificationService = new NotificationService();

export class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const notifications = await notificationService.getNotificationsByUserId(
        userId.toString(),
      );

      return res.status(200).json({
        success: true,
        message: "Notifications retrieved",
        data: notifications,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const count = await notificationService.getUnreadCount(userId.toString());

      return res.status(200).json({
        success: true,
        message: "Unread count retrieved",
        data: count,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const updated = await notificationService.markAsRead(id);

      return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: updated,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      await notificationService.markAllAsRead(userId.toString());

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const deleted = await notificationService.deleteNotification(id);

      return res.status(200).json({
        success: true,
        message: deleted ? "Notification deleted" : "Notification not found",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
