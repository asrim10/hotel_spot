import z from "zod";

export const ReviewSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  hotelId: z.string().min(1, "Hotel ID is required"),

  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),

  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),

  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
