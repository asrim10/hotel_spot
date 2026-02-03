"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

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

  const onSubmit = async (data: UpdateUserData) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("username", data.username);
      if (data.image) {
        formData.append("image", data.image);
      }
      const response = await handleUpdateProfile(formData);

      if (!response.success) {
        throw new Error(response.message || "Update profile failed");
      }

      // Update auth context
      await checkAuth();

      handleDismissImage();
      toast.success("Profile updated successfully");

      // Redirect back to profile page
      router.push("/user/profile");
    } catch (error: Error | any) {
      toast.error(error.message || "Profile update failed");
      setError(error.message || "Profile update failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-500 mt-1">Update your personal information</p>
        </div>
        <Link
          href="/user/profile"
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back to Profile
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-blue-500 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>

        <form className="px-8 py-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Profile Image Section */}
          <div className="mb-8 -mt-20">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.imageUrl ? (
                    <img
                      src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                      alt="Profile Image"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
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
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                      >
                        ✕
                      </button>
                    )}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Picture
                </label>
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
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  )}
                />
                {errors.image && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Full Name */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                {...register("fullName")}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors  text-gray-500"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors text-gray-500"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors  text-gray-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <Link
              href="/user/profile"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
