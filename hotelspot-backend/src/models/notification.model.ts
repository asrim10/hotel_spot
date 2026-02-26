import mongoose, { Document, Schema } from "mongoose";
import { NotificationType } from "../types/notification.type";

const NotificationSchema: Schema = new Schema<NotificationType>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "booking_confirmed",
        "booking_cancelled",
        "checked_in",
        "checked_out",
        "booking_pending",
        "general",
      ],
      required: true,
    },
    bookingId: { type: String, required: false },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export interface INotification extends NotificationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const NotificationModel = mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
