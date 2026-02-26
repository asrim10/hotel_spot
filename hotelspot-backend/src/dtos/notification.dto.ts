// src/dtos/notification.dto.ts
import z from "zod";
import { NotificationSchema } from "../types/notification.type";

export const CreateNotificationDTO = z.object({
  userId: NotificationSchema.shape.userId,
  title: NotificationSchema.shape.title,
  message: NotificationSchema.shape.message,
  type: NotificationSchema.shape.type,
  bookingId: NotificationSchema.shape.bookingId,
});

export type CreateNotificationDTO = z.infer<typeof CreateNotificationDTO>;

export const UpdateNotificationDTO = z.object({
  isRead: NotificationSchema.shape.isRead.optional(),
});

export type UpdateNotificationDTO = z.infer<typeof UpdateNotificationDTO>;
