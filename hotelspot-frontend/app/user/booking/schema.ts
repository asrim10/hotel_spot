import { z } from "zod";

const PAYMENT_METHODS = ["cash", "card", "online"] as const;
const PAYMENT_STATUS = ["pending", "paid", "failed"] as const;
const BOOKING_STATUS = [
  "pending",
  "confirmed",
  "cancelled",
  "checked_in",
  "checked_out",
] as const;

export const BookingSchema = z.object({
  hotelId: z.string().min(1, { message: "Hotel ID is required" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  checkInDate: z.string().min(1, { message: "Check-in date is required" }),
  checkOutDate: z.string().min(1, { message: "Check-out date is required" }),
  totalPrice: z
    .number()
    .min(0, { message: "Total price must be greater than or equal to 0" }),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  paymentStatus: z.enum(PAYMENT_STATUS).optional(),
  status: z.enum(BOOKING_STATUS).optional().default("pending"),
});

export type CreateBookingDTO = z.infer<typeof BookingSchema>;

export const BookingEditSchema = BookingSchema.partial();
export type UpdateBookingDTO = z.infer<typeof BookingEditSchema>;
