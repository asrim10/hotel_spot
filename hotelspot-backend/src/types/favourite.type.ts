import z from "zod";

export const FavouriteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  hotelId: z.string().min(1, "Hotel ID is required"),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type FavouriteType = z.infer<typeof FavouriteSchema>;
