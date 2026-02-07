import z from "zod";

export const HotelSchema = z.object({
  hotelName: z.string().min(2, "Hotel name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  rating: z.coerce
    .number()
    .min(0)
    .max(5, "Rating must be between 0 and 5")
    .optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  availableRooms: z.coerce
    .number()
    .min(0, "Available rooms cannot be negative")
    .int(),
  imageUrl: z.string().optional(),
});

export type HotelType = z.infer<typeof HotelSchema>;
