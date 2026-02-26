import { Request, Response } from "express";
import mongoose from "mongoose";
import { AdminNotificationService } from "../../services/admin/notification.service";

const adminNotificationService = new AdminNotificationService();

export class AdminNotificationController {
  async getAllNotifications(req: Request, res: Response) {
    try {
      const notifications =
        await adminNotificationService.getAllNotifications();

      return res.status(200).json({
        success: true,
        message: "All notifications retrieved",
        data: notifications,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getNotificationById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid notification ID",
        });
      }

      const notification =
        await adminNotificationService.getNotificationById(id);

      return res.status(200).json({
        success: true,
        message: "Notification retrieved",
        data: notification,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getNotificationsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const notifications =
        await adminNotificationService.getNotificationsByUserId(userId);

      return res.status(200).json({
        success: true,
        message: "User notifications retrieved",
        data: notifications,
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

      await adminNotificationService.deleteNotification(id);

      return res.status(200).json({
        success: true,
        message: "Notification deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteAllByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      await adminNotificationService.deleteAllByUserId(userId);

      return res.status(200).json({
        success: true,
        message: "All notifications for user deleted",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
