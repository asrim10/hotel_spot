import z from "zod";

export const PaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  totalPrice: z.coerce.number().min(1, "Total price must be greater than 0"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),

  pidx: z.string().optional(),
  transactionId: z.string().optional(),

  paymentMethod: z.enum(["cash", "card", "online"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed"]).default("pending"),

  khaltiStatus: z.enum([
    "Completed",
    "Pending",
    "Initiated",
    "Refunded",
    "Expired",
    "User canceled",
  ]),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
