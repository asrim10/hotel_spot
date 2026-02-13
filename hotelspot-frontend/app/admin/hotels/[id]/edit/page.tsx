"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  handleGetOneHotel,
  handleUpdateHotel,
} from "@/lib/actions/admin/hotel-action";
import { HotelEditData, HotelEditSchema } from "../../schema";

export default function EditHotelPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HotelEditData>({
    resolver: zodResolver(HotelEditSchema),
    defaultValues: {
      hotelName: "",
      address: "",
      city: "",
      country: "",
      rating: 0,
      description: "",
      price: 0,
      availableRooms: 0,
      image: undefined,
    },
  });

  const watchedImage = watch("image");

  // Update image preview when file changes
  useEffect(() => {
    if (watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(watchedImage);
    }
  }, [watchedImage]);

  // Fetch hotel data
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setFetching(true);

        const response = await handleGetOneHotel(id);

        if (response.success) {
          const hotel = response.data;

          setValue("hotelName", hotel?.hotelName || "");
          setValue("address", hotel?.address || "");
          setValue("city", hotel?.city || "");
          setValue("country", hotel?.country || "");
          setValue("rating", hotel?.rating || 0);
          setValue("description", hotel?.description || "");
          setValue("price", hotel?.price || 0);
          setValue("availableRooms", hotel?.availableRooms || 0);

          // Set existing hotel image as preview if available
          if (hotel?.image) {
            setImagePreview(hotel.image); // assuming hotel.image is a URL
          }
        } else {
          toast.error(response.message || "Failed to fetch hotel");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchHotel();
  }, [id, setValue]);

  // Submit update
  const onSubmit = async (data: HotelEditData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      if (data.hotelName) formData.append("hotelName", data.hotelName);
      if (data.address) formData.append("address", data.address);
      if (data.city) formData.append("city", data.city);
      if (data.country) formData.append("country", data.country);
      if (data.rating !== undefined)
        formData.append("rating", String(data.rating));
      if (data.description) formData.append("description", data.description);
      if (data.price !== undefined)
        formData.append("price", String(data.price));
      if (data.availableRooms !== undefined)
        formData.append("availableRooms", String(data.availableRooms));
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await handleUpdateHotel(id, formData);

      if (response.success) {
        toast.success("Hotel updated successfully!");
        router.push("/admin/hotels");
      } else {
        toast.error(response.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Update hotel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-6xl bg-[#111827] border border-white/10 rounded-2xl shadow-xl p-10">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-4">Edit Hotel</h1>

        {/* Note */}
        <div className="bg-[#1f2937] text-blue-400 rounded-xl px-4 py-3 mb-10 border border-blue-500/20">
          Note: Update hotel details and click Save Changes.
        </div>

        {fetching ? (
          <p className="text-white/70 text-lg">Loading hotel details...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Hotel Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  {...register("hotelName")}
                  placeholder="Enter hotel name"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.hotelName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.hotelName.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  {...register("address")}
                  placeholder="Enter hotel address"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.address && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* City */}
              <div>
                <label className="block text-white font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Enter city"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  {...register("country")}
                  placeholder="Enter country"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.country && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Price */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="Enter price"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Available Rooms */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Available Rooms
                </label>
                <input
                  type="number"
                  {...register("availableRooms", { valueAsNumber: true })}
                  placeholder="Enter available rooms"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.availableRooms && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.availableRooms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Rating */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Rating (0 - 5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("rating", { valueAsNumber: true })}
                  placeholder="Enter rating"
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
                {errors.rating && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Image */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Upload Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-full border-2 border-purple-500"
                    />
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("image", file);
                    }
                  }}
                  className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none file:bg-purple-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
                />
                {errors.image && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.image.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <textarea
                rows={5}
                {...register("description")}
                placeholder="Enter description"
                className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/hotels")}
                className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
