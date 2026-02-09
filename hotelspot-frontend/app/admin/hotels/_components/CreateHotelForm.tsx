"use client";
import { Controller, useForm } from "react-hook-form";
import { HotelData, HotelSchema } from "..//schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateHotel } from "@/lib/actions/admin/hotel-action";
import { useRouter } from "next/navigation";

export default function CreateHotelForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HotelData>({
    resolver: zodResolver(HotelSchema),
  });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: HotelData) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("hotelName", data.hotelName);
        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("country", data.country);
        formData.append("price", data.price.toString());
        formData.append("availableRooms", data.availableRooms.toString());

        if (data.rating !== undefined) {
          formData.append("rating", data.rating.toString());
        }

        if (data.description) {
          formData.append("description", data.description);
        }

        if (data.image) {
          formData.append("image", data.image);
        }

        const response = await handleCreateHotel(formData);

        if (!response.success) {
          throw new Error(response.message || "Create hotel failed");
        }

        reset();
        handleDismissImage();
        toast.success("Hotel created successfully");
        router.push("/admin/hotels");
      } catch (error: Error | any) {
        toast.error(error.message || "Create hotel failed");
        setError(error.message || "Create hotel failed");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Hotel Image Display */}
      <div className="mb-4">
        {previewImage ? (
          <div className="relative w-full h-48">
            <img
              src={previewImage}
              alt="Hotel Image Preview"
              className="w-full h-48 rounded-md object-cover"
            />
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => handleDismissImage(onChange)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-300 rounded-md flex items-center justify-center">
            <span className="text-gray-600">No Image</span>
          </div>
        )}
      </div>

      {/* Hotel Image Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Hotel Image</label>
        <Controller
          name="image"
          control={control}
          render={({ field: { onChange } }) => (
            <input
              ref={fileInputRef}
              type="file"
              onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
              accept=".jpg,.jpeg,.png,.webp"
            />
          )}
        />
        {errors.image && (
          <p className="text-xs text-red-600">{errors.image.message}</p>
        )}
      </div>

      {/* Hotel Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="hotelName">
          Hotel Name
        </label>
        <input
          id="hotelName"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("hotelName")}
          placeholder="Grand Plaza Hotel"
        />
        {errors.hotelName?.message && (
          <p className="text-xs text-red-600">{errors.hotelName.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="address">
          Address
        </label>
        <input
          id="address"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("address")}
          placeholder="123 Main Street"
        />
        {errors.address?.message && (
          <p className="text-xs text-red-600">{errors.address.message}</p>
        )}
      </div>

      {/* City and Country */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("city")}
            placeholder="New York"
          />
          {errors.city?.message && (
            <p className="text-xs text-red-600">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("country")}
            placeholder="United States"
          />
          {errors.country?.message && (
            <p className="text-xs text-red-600">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Price and Available Rooms */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="price">
            Price per Night (Rs.)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("price", { valueAsNumber: true })}
            placeholder="150.00"
          />
          {errors.price?.message && (
            <p className="text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="availableRooms">
            Available Rooms
          </label>
          <input
            id="availableRooms"
            type="number"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("availableRooms", { valueAsNumber: true })}
            placeholder="25"
          />
          {errors.availableRooms?.message && (
            <p className="text-xs text-red-600">
              {errors.availableRooms.message}
            </p>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="rating">
          Rating (0-5)
        </label>
        <input
          id="rating"
          type="number"
          step="0.1"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("rating", { valueAsNumber: true })}
          placeholder="4.5"
        />
        {errors.rating?.message && (
          <p className="text-xs text-red-600">{errors.rating.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          {...register("description")}
          placeholder="Describe the hotel amenities, location, and features..."
        />
        {errors.description?.message && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating hotel..." : "Create hotel"}
      </button>
    </form>
  );
}
