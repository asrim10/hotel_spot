import { NotificationModel, INotification } from "../models/notification.model";

export interface INotificationRepository {
  create(data: any): Promise<INotification>;
  getById(id: string): Promise<INotification | null>;
  getByUserId(userId: string): Promise<INotification[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(id: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<INotification[]>;
  deleteAllByUserId(userId: string): Promise<void>;
}

export class NotificationRepository implements INotificationRepository {
  async create(data: any): Promise<INotification> {
    const notification = new NotificationModel(data);
    return await notification.save();
  }

  async getById(id: string): Promise<INotification | null> {
    return await NotificationModel.findById(id);
  }

  async getByUserId(userId: string): Promise<INotification[]> {
    return await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await NotificationModel.countDocuments({ userId, isRead: false });
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await NotificationModel.findByIdAndDelete(id);
    return deleted !== null;
  }
  async getAll(): Promise<INotification[]> {
    return await NotificationModel.find().sort({ createdAt: -1 });
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await NotificationModel.deleteMany({ userId });
  }
}
