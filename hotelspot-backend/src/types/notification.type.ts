import z from "zod";

export const NotificationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  type: z.enum([
    "booking_confirmed",
    "booking_cancelled",
    "checked_in",
    "checked_out",
    "booking_pending",
    "general",
  ]),
  bookingId: z.string().optional(),
  isRead: z.boolean().default(false),
});

export type NotificationType = z.infer<typeof NotificationSchema>;
