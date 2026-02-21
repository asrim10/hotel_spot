"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const inputCls =
  "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-5 py-3.5 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-[#3a3a3a]";
const labelCls =
  "block text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-2.5 pt-3.5";
const errCls = "text-[#f87171] text-[11px] mt-1.5";

export default function UpdateUserForm({ user }: { user: any }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Partial<UserData>>({
    resolver: zodResolver(UserSchema.partial()),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email || "",
      username: user.username || "",
      image: undefined,
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
    } else setPreviewImage(null);
    onChange(file);
  };

  const handleDismissImage = (onChange?: (f: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: Partial<UserData>) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        if (data.fullName) formData.append("fullName", data.fullName);
        if (data.email) formData.append("email", data.email);
        if (data.username) formData.append("username", data.username);
        if (data.image) formData.append("image", data.image);
        const response = await handleUpdateUser(user._id, formData);
        if (!response.success)
          throw new Error(response.message || "Update profile failed");
        reset();
        handleDismissImage();
        toast.success("Profile updated successfully");
        router.push("/admin/users");
      } catch (err: any) {
        toast.error(err.message || "Update profile failed");
        setError(err.message || "Update profile failed");
      }
    });
  };

  const avatarSrc =
    previewImage ||
    (user.imageUrl
      ? process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl
      : null);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="border-b border-[#1a1a1a] px-12 py-12 flex items-end justify-between">
        <div>
          <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
            Admin Panel
          </p>
          <h1
            className="text-white text-4xl font-bold uppercase leading-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Edit User
          </h1>
        </div>
        <Link
          href="/admin/users"
          className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-[#3a3a3a] hover:text-[#9ca3af] transition-colors"
        >
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-12 py-12">
        <div className="mb-12">
          <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase mb-6">
            Profile Image
          </p>
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1a1a1a] shrink-0 relative flex items-center justify-center bg-[#111]">
              {avatarSrc ? (
                <>
                  <img
                    src={avatarSrc}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {previewImage && (
                    <Controller
                      name="image"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <button
                          type="button"
                          onClick={() => handleDismissImage(onChange)}
                          className="absolute top-0 right-0 bg-[#0a0a0a] text-white w-5 h-5 flex items-center justify-center cursor-pointer border-none"
                        >
                          <X size={10} />
                        </button>
                      )}
                    />
                  )}
                </>
              ) : (
                <p className="text-[#2a2a2a] text-[9px] tracking-widest uppercase text-center m-0">
                  None
                </p>
              )}
            </div>
            <div>
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
                    className="text-[#6b7280] text-xs"
                  />
                )}
              />
              {errors.image && <p className={errCls}>{errors.image.message}</p>}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a]">
          <div className="grid grid-cols-[1fr_2fr] gap-12 py-8 border-b border-[#1a1a1a] items-start">
            <label className={labelCls} htmlFor="fullName">
              Full Name
            </label>
            <div>
              <input
                id="fullName"
                type="text"
                autoComplete="given-name"
                {...register("fullName")}
                placeholder="Jane Doe"
                className={inputCls}
              />
              {errors.fullName?.message && (
                <p className={errCls}>{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-12 py-8 border-b border-[#1a1a1a] items-start">
            <label className={labelCls} htmlFor="email">
              Email
            </label>
            <div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                placeholder="you@example.com"
                className={inputCls}
              />
              {errors.email?.message && (
                <p className={errCls}>{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-12 py-8 border-b border-[#1a1a1a] items-start">
            <label className={labelCls} htmlFor="username">
              Username
            </label>
            <div>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register("username")}
                placeholder="janedoe"
                className={inputCls}
              />
              {errors.username?.message && (
                <p className={errCls}>{errors.username.message}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 px-5 py-4 border border-[#7f1d1d] bg-[#1a0a0a] text-[#f87171] text-sm">
            {error}
          </div>
        )}

        <div className="mt-12 flex justify-end gap-4">
          <Link
            href="/admin/users"
            className="border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-[#3a3a3a] hover:text-[#9ca3af] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="bg-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-[0.18em] uppercase px-10 py-3.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-none"
          >
            {isSubmitting || pending ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
