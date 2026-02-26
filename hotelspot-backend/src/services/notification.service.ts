// src/services/notification.service.ts
import { CreateNotificationDTO } from "../dtos/notification.dto";
import { HttpError } from "../errors/http-error";
import { NotificationRepository } from "../repositories/notification.repositories";

const notificationRepository = new NotificationRepository();

export class NotificationService {
  async createNotification(data: CreateNotificationDTO) {
    const notification = await notificationRepository.create(data);
    return notification;
  }

  async getNotificationsByUserId(userId: string) {
    const notifications = await notificationRepository.getByUserId(userId);
    return notifications;
  }

  async getNotificationById(id: string) {
    const notification = await notificationRepository.getById(id);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    return notification;
  }

  async getUnreadCount(userId: string) {
    const count = await notificationRepository.getUnreadCount(userId);
    return count;
  }

  async markAsRead(id: string) {
    const notification = await notificationRepository.getById(id);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    const updated = await notificationRepository.markAsRead(id);
    return updated;
  }

  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);
  }

  async deleteNotification(id: string) {
    const notification = await notificationRepository.getById(id);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    const deleted = await notificationRepository.delete(id);
    return deleted;
  }
}
