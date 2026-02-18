import z from "zod";
import { FavouriteSchema } from "../types/favourite.type";

export const CreateFavouriteDTO = z.object({
  hotelId: z.string().min(1, "Hotel ID is required"),
});
export type CreateFavouriteDTO = z.infer<typeof CreateFavouriteDTO>;

export const RemoveFavouriteDTO = z.object({
  hotelId: FavouriteSchema.shape.hotelId,
});

export type RemoveFavouriteDTO = z.infer<typeof RemoveFavouriteDTO>;
