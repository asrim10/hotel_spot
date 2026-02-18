import z from "zod";
import { BookingSchema } from "../types/booking.type";

export const CreateBookingDTO = z.object({
  hotelId: BookingSchema.shape.hotelId,
  fullName: BookingSchema.shape.fullName,
  email: BookingSchema.shape.email,
  checkInDate: BookingSchema.shape.checkInDate,
  checkOutDate: BookingSchema.shape.checkOutDate,
  totalPrice: BookingSchema.shape.totalPrice,
  paymentMethod: BookingSchema.shape.paymentMethod,
});

export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

export const UpdateBookingDTO = z.object({
  status: BookingSchema.shape.status.optional(),
  paymentStatus: BookingSchema.shape.paymentStatus.optional(),
  paymentMethod: BookingSchema.shape.paymentMethod.optional(),
});

export type UpdateBookingDTO = z.infer<typeof UpdateBookingDTO>;
