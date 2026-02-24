// src/types/booking.type.ts
import z from "zod";

export const BookingSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    hotelId: z.string().min(1, "Hotel ID is required"),

    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),

    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().min(1, "Check-out date is required"),

    totalPrice: z.coerce.number().min(0, "Total price must be greater than 0"),

    paymentMethod: z.enum(["cash", "card", "online"]).optional(),
    paymentStatus: z.enum(["pending", "paid", "failed"]).optional(),

    status: z
      .enum(["pending", "confirmed", "cancelled", "checked_in", "checked_out"])
      .default("pending"),

    pidx: z.string().optional(),
    transactionId: z.string().optional(),
  })
  .refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  });

export type BookingType = z.infer<typeof BookingSchema>;
