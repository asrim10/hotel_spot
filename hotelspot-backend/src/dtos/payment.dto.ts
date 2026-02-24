import z from "zod";

export const InitiatePaymentDto = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  totalPrice: z.coerce.number().min(1, "Total price must be greater than 0"),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
});

export const VerifyPaymentDto = z.object({
  pidx: z.string().min(1, "pidx is required"),
});

export type InitiatePaymentDtoType = z.infer<typeof InitiatePaymentDto>;
export type VerifyPaymentDtoType = z.infer<typeof VerifyPaymentDto>;
