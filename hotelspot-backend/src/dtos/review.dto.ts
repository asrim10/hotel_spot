import z from "zod";
import { ReviewSchema } from "../types/review.types";

// DTO for creating a new review
export const CreateReviewDTO = ReviewSchema.pick({
  userId: true,
  hotelId: true,
  fullName: true,
  email: true,
  rating: true,
  comment: true,
});

export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;

export const UpdateReviewDTO = ReviewSchema.pick({
  rating: true,
  comment: true,
}).partial();

export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;

export const ReviewQueryDTO = z.object({
  hotelId: z.string().optional(),
  userId: z.string().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  maxRating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["rating", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ReviewQueryDTO = z.infer<typeof ReviewQueryDTO>;
