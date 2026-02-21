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
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#111",
  border: "1px solid #2a2a2a",
  color: "#fff",
  fontSize: 13,
  padding: "0.85rem 1.25rem",
  outline: "none",
  fontFamily: "'Rethink Sans', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#c9a96e",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  marginBottom: "0.6rem",
  fontFamily: "'Rethink Sans', sans-serif",
};

const errorStyle: React.CSSProperties = {
  color: "#f87171",
  fontSize: 11,
  marginTop: "0.4rem",
  fontFamily: "'Rethink Sans', sans-serif",
};

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

  useEffect(() => {
    if (watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(watchedImage);
    }
  }, [watchedImage]);

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
          if (hotel?.imageUrl)
            setImagePreview(
              (process.env.NEXT_PUBLIC_API_BASE_URL || "") + hotel.imageUrl,
            );
        } else {
          toast.error(response.message || "Failed to fetch hotel");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchHotel();
  }, [id, setValue]);

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
      if (data.image) formData.append("image", data.image);

      const response = await handleUpdateHotel(id, formData);
      if (response.success) {
        toast.success("Hotel updated!");
        router.push("/admin/hotels");
      } else toast.error(response.message || "Update failed");
    } catch (err: any) {
      toast.error(err.message || "Update hotel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'Rethink Sans', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "3rem 3rem 2.5rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              color: "#c9a96e",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: "0 0 0.75rem",
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(24px, 3vw, 44px)",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "'Georgia', serif",
            }}
          >
            Edit Hotel
          </h1>
        </div>
        <Link
          href="/admin/hotels"
          style={{
            background: "none",
            border: "1px solid #2a2a2a",
            color: "#6b7280",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            padding: "0.75rem 1.5rem",
            textDecoration: "none",
            fontFamily: "'Rethink Sans', sans-serif",
          }}
        >
          ← Back
        </Link>
      </div>

      {fetching ? (
        <div
          style={{
            padding: "6rem 3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              color: "#3a3a3a",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Loading hotel details...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "3rem" }}>
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                color: "#3a3a3a",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 1.5rem",
              }}
            >
              Hotel Image
            </p>
            <div
              style={{
                width: "100%",
                height: 200,
                background: "#0d0d0d",
                border: "1px solid #1a1a1a",
                overflow: "hidden",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      color: "#2a2a2a",
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    No Image
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue("image", file);
              }}
              style={{
                color: "#6b7280",
                fontSize: 12,
                fontFamily: "'Rethink Sans', sans-serif",
              }}
            />
            {errors.image && (
              <p style={errorStyle}>{errors.image.message as string}</p>
            )}
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label
                style={{ ...labelStyle, paddingTop: "0.9rem" }}
                htmlFor="hotelName"
              >
                Hotel Name
              </label>
              <div>
                <input
                  id="hotelName"
                  type="text"
                  {...register("hotelName")}
                  placeholder="Enter hotel name"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
                {errors.hotelName && (
                  <p style={errorStyle}>{errors.hotelName.message}</p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label
                style={{ ...labelStyle, paddingTop: "0.9rem" }}
                htmlFor="address"
              >
                Address
              </label>
              <div>
                <input
                  id="address"
                  type="text"
                  {...register("address")}
                  placeholder="Enter hotel address"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
                {errors.address && (
                  <p style={errorStyle}>{errors.address.message}</p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label style={{ ...labelStyle, paddingTop: "0.9rem" }}>
                City & Country
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <input
                    id="city"
                    type="text"
                    {...register("city")}
                    placeholder="Kathmandu"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                    onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                  />
                  {errors.city && (
                    <p style={errorStyle}>{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    id="country"
                    type="text"
                    {...register("country")}
                    placeholder="Nepal"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                    onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                  />
                  {errors.country && (
                    <p style={errorStyle}>{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label style={{ ...labelStyle, paddingTop: "0.9rem" }}>
                Price & Rooms
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: 14,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#c9a96e",
                        fontSize: 12,
                        pointerEvents: "none",
                      }}
                    >
                      Rs.
                    </span>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="5000"
                      style={{ ...inputStyle, paddingLeft: 44 }}
                      onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                      onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                    />
                  </div>
                  {errors.price && (
                    <p style={errorStyle}>{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <input
                    id="availableRooms"
                    type="number"
                    {...register("availableRooms", { valueAsNumber: true })}
                    placeholder="25"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                    onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                  />
                  {errors.availableRooms && (
                    <p style={errorStyle}>{errors.availableRooms.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label
                style={{ ...labelStyle, paddingTop: "0.9rem" }}
                htmlFor="rating"
              >
                Rating (0–5)
              </label>
              <div>
                <input
                  id="rating"
                  type="number"
                  step="0.1"
                  {...register("rating", { valueAsNumber: true })}
                  placeholder="4.5"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
                {errors.rating && (
                  <p style={errorStyle}>{errors.rating.message}</p>
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "3rem",
                padding: "2rem 0",
                borderBottom: "1px solid #1a1a1a",
                alignItems: "start",
              }}
            >
              <label
                style={{ ...labelStyle, paddingTop: "0.9rem" }}
                htmlFor="description"
              >
                Description
              </label>
              <div>
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  placeholder="Enter description"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                  onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                  onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                />
                {errors.description && (
                  <p style={errorStyle}>{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "3rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <button
              type="button"
              onClick={() => router.push("/admin/hotels")}
              style={{
                background: "none",
                border: "1px solid #2a2a2a",
                color: "#6b7280",
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "0.85rem 1.75rem",
                cursor: "pointer",
                fontFamily: "'Rethink Sans', sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#c9a96e",
                border: "none",
                color: "#0a0a0a",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.85rem 2.5rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                fontFamily: "'Rethink Sans', sans-serif",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
