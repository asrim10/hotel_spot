"use client";

import { Controller, useForm } from "react-hook-form";
import { HotelData, HotelSchema } from "..//schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateHotel } from "@/lib/actions/admin/hotel-action";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

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

export default function CreateHotelForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HotelData>({ resolver: zodResolver(HotelSchema) });
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    file: File | undefined,
    onChange: (f: File | undefined) => void,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const handleDismissImage = (onChange?: (f: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        if (data.rating !== undefined)
          formData.append("rating", data.rating.toString());
        if (data.description) formData.append("description", data.description);
        if (data.image) formData.append("image", data.image);

        const response = await handleCreateHotel(formData);
        if (!response.success)
          throw new Error(response.message || "Create hotel failed");

        reset();
        handleDismissImage();
        toast.success("Hotel created successfully");
        router.push("/admin/hotels");
      } catch (err: any) {
        toast.error(err.message || "Create hotel failed");
        setError(err.message || "Create hotel failed");
      }
    });
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
            Create Hotel
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
              position: "relative",
              width: "100%",
              height: 200,
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            {previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "#0a0a0a",
                        border: "1px solid #2a2a2a",
                        color: "#fff",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                />
              </>
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
                  No Image Selected
                </p>
              </div>
            )}
          </div>
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange } }) => (
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) =>
                  handleImageChange(e.target.files?.[0], onChange)
                }
                accept=".jpg,.jpeg,.png,.webp"
                style={{
                  color: "#6b7280",
                  fontSize: 12,
                  fontFamily: "'Rethink Sans', sans-serif",
                }}
              />
            )}
          />
          {errors.image && <p style={errorStyle}>{errors.image.message}</p>}
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
                placeholder="Grand Plaza Hotel"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
              {errors.hotelName?.message && (
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
                placeholder="123 Main Street"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
              {errors.address?.message && (
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
                {errors.city?.message && (
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
                {errors.country?.message && (
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
                {errors.price?.message && (
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
                {errors.availableRooms?.message && (
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
              {errors.rating?.message && (
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
                placeholder="Describe the hotel amenities, location, and features..."
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }}
                onFocus={(e) => (e.target.style.borderColor = "#c9a96e")}
                onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
              />
              {errors.description?.message && (
                <p style={errorStyle}>{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: "2rem 0",
              padding: "1rem 1.25rem",
              border: "1px solid #7f1d1d",
              background: "#1a0a0a",
              color: "#f87171",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <Link
            href="/admin/hotels"
            style={{
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#6b7280",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.85rem 1.75rem",
              textDecoration: "none",
              display: "inline-block",
              fontFamily: "'Rethink Sans', sans-serif",
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || pending}
            style={{
              background: "#c9a96e",
              border: "none",
              color: "#0a0a0a",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.85rem 2.5rem",
              cursor: isSubmitting || pending ? "not-allowed" : "pointer",
              opacity: isSubmitting || pending ? 0.6 : 1,
              fontFamily: "'Rethink Sans', sans-serif",
            }}
          >
            {isSubmitting || pending ? "Creating..." : "Create Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
}
