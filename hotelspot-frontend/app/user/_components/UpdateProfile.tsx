"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../schema";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function UpdateUserForm({ user }: { user: any }) {
  const router = useRouter();
  const { checkAuth } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    values: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
    },
  });

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

  const onSubmit = async (data: UpdateUserData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      if (data.image) formData.append("image", data.image);

      const response = await handleUpdateProfile(formData);
      if (!response.success)
        throw new Error(response.message || "Update profile failed");

      await checkAuth();
      handleDismissImage();
      toast.success("Profile updated successfully");
      router.push("/user/profile");
    } catch (err: any) {
      toast.error(err.message || "Profile update failed");
      setError(err.message || "Profile update failed");
    }
  };

  const initials = user?.username?.charAt(0).toUpperCase() || "U";
  const currentImage = previewImage
    ? previewImage
    : user?.imageUrl
      ? process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl
      : null;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div
        className="min-h-screen bg-[#0a0a0a] text-white"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/*  Hero  */}
        <div className="relative h-[38vh] min-h-65 border-b border-white/6 px-10 flex flex-col justify-end pb-10 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-b from-white/1 to-transparent pointer-events-none" />

          {/* Top row */}
          <div className="flex items-start justify-between mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b8a]">
              Your Account
            </p>
            <Link
              href="/user/profile"
              className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b8a] hover:text-white/60 transition-colors no-underline"
            >
              ← Back to Profile
            </Link>
          </div>

          {/* Avatar + title */}
          <div className="flex items-end gap-6">
            {/* Avatar with dismiss button */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-[#2a2a2a]">
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-[#0a0a0a] text-[26px] font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              {previewImage && (
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <button
                      type="button"
                      onClick={() => handleDismissImage(onChange)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-none text-white text-[9px] flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                />
              )}
            </div>

            {/* Title + file input */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-[42px] font-bold leading-none text-white uppercase mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Edit Profile
              </h1>
              {/* Profile picture upload in hero stats area */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1.5">
                  Profile Picture
                </p>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0], onChange)
                        }
                        accept=".jpg,.jpeg,.png,.webp"
                        className="text-[13px] text-[#6b6b8a] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-white/10 file:bg-white/4 file:text-xs file:text-[#6b6b8a] file:cursor-pointer file:uppercase file:tracking-wider hover:file:border-white/20 hover:file:text-white/60 file:transition-all"
                        style={{ fontFamily: "'Georgia', serif" }}
                      />
                      {errors.image && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.image.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/*  Body  */}
        <div className="max-w-215 mx-auto px-10 py-14">
          {/* Section header */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] mb-1.5">
              Update Details
            </p>
            <h2
              className="text-[32px] font-bold text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Personal Info
            </h2>
            <div className="mt-4 h-px bg-white/6" />
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-8 px-5 py-4 border border-red-900/60 bg-red-950/30 text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-t border-white/4">
              {/* Full Name */}
              <div className="flex items-baseline gap-8 py-5 border-b border-white/4">
                <label
                  htmlFor="fullName"
                  className="w-44 shrink-0 text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] pt-0.5"
                >
                  Full Name
                </label>
                <div className="flex-1">
                  <input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className="w-full bg-transparent border-b border-white/10 text-sm text-white/80 placeholder:text-[#6b6b8a] py-2 outline-none focus:border-[#C9A84C]/40 transition-colors"
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="flex items-baseline gap-8 py-5 border-b border-white/4">
                <label
                  htmlFor="username"
                  className="w-44 shrink-0 text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] pt-0.5"
                >
                  Username
                </label>
                <div className="flex-1">
                  <input
                    id="username"
                    placeholder="Enter your username"
                    {...register("username")}
                    className="w-full bg-transparent border-b border-white/10 text-sm text-white/80 placeholder:text-[#6b6b8a] py-2 outline-none focus:border-[#C9A84C]/40 transition-colors"
                  />
                  {errors.username && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-baseline gap-8 py-5 border-b border-white/4">
                <label
                  htmlFor="email"
                  className="w-44 shrink-0 text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a] pt-0.5"
                >
                  Email Address
                </label>
                <div className="flex-1">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className="w-full bg-transparent border-b border-white/10 text-sm text-white/80 placeholder:text-[#6b6b8a] py-2 outline-none focus:border-[#C9A84C]/40 transition-colors"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-12 flex justify-end gap-3">
              <Link
                href="/user/profile"
                className="px-5 py-2.5 rounded-lg border border-white/10 bg-transparent text-sm text-[#6b6b8a] uppercase tracking-widest hover:border-white/20 hover:text-white/60 transition-all no-underline"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-sm text-[#C9A84C] uppercase tracking-widest hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
