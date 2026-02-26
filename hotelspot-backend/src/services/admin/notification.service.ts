import { HttpError } from "../../errors/http-error";
import { CreateNotificationDTO } from "../../dtos/notification.dto";
import { NotificationRepository } from "../../repositories/notification.repositories";

const notificationRepository = new NotificationRepository();

export class AdminNotificationService {
  async getAllNotifications() {
    const notifications = await notificationRepository.getAll();
    return notifications;
  }

  async getNotificationById(id: string) {
    const notification = await notificationRepository.getById(id);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    return notification;
  }

  async getNotificationsByUserId(userId: string) {
    const notifications = await notificationRepository.getByUserId(userId);
    return notifications;
  }

  async createNotification(data: CreateNotificationDTO) {
    const notification = await notificationRepository.create(data);
    return notification;
  }

  async deleteNotification(id: string) {
    const notification = await notificationRepository.getById(id);

    if (!notification) {
      throw new HttpError(404, "Notification not found");
    }

    const deleted = await notificationRepository.delete(id);
    return deleted;
  }

  async deleteAllByUserId(userId: string) {
    await notificationRepository.deleteAllByUserId(userId);
  }
}
