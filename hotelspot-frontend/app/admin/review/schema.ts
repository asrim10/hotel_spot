import { z } from "zod";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  hotelId: z.string().min(1, "Hotel ID is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment too long"),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(5).max(1000).optional(),
});

export type ReviewCreateData = z.infer<typeof createReviewSchema>;
export type ReviewUpdateData = z.infer<typeof updateReviewSchema>;

export interface PopulatedUser {
  _id: string;
  name: string;
  email?: string;
}

export interface PopulatedHotel {
  _id: string;
  name: string;
}

export interface IReview {
  _id: string;
  userId: string | PopulatedUser;
  hotelId: string | PopulatedHotel;
  fullName: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
