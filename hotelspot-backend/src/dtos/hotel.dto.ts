import z from "zod";
import { HotelSchema } from "../types/hotel.type";

export const CreateHotelDTO = HotelSchema.pick({
  hotelName: true,
  address: true,
  city: true,
  country: true,
  rating: true,
  description: true,
  price: true,
  availableRooms: true,
  imageUrl: true,
});

export type CreateHotelDTO = z.infer<typeof CreateHotelDTO>;

export const UpdateHotelDTO = HotelSchema.partial();
export type UpdateHotelDTO = z.infer<typeof UpdateHotelDTO>;

export const HotelQueryDTO = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  availableRooms: z.coerce.number().min(1).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(["price", "rating", "hotelName"]).optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

export type HotelQueryDTO = z.infer<typeof HotelQueryDTO>;
