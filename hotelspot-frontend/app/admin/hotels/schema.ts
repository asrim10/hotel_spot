import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const HotelSchema = z.object({
  hotelName: z
    .string()
    .min(2, { message: "Hotel name must be at least 2 characters" }),
  address: z
    .string()
    .min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters" }),
  rating: z
    .number()
    .min(0, { message: "Rating must be at least 0" })
    .max(5, { message: "Rating must be at most 5" })
    .optional(),
  description: z.string().optional(),
  price: z
    .number()
    .min(0, { message: "Price must be greater than or equal to 0" }),
  availableRooms: z
    .number()
    .min(0, { message: "Available rooms cannot be negative" })
    .int({ message: "Available rooms must be a whole number" }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});

export type HotelData = z.infer<typeof HotelSchema>;

export const HotelEditSchema = HotelSchema.partial();
export type HotelEditData = z.infer<typeof HotelEditSchema>;
