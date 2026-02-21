"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { UpdateUserData, updateUserSchema } from "../schema";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import DarkPageLayout, {
  DarkSection,
  DarkButton,
  DarkInput,
  styles,
} from "@/app/_components/ui/DarkPage";

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

  const avatar = (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid #2a2a2a",
        }}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #c9a96e 0%, #8b6914 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0a0a",
              fontSize: 26,
              fontWeight: 700,
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
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#ef4444",
                border: "none",
                color: "#fff",
                fontSize: 9,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          )}
        />
      )}
    </div>
  );

  return (
    <DarkPageLayout
      eyebrow="Your Account"
      title="Edit Profile"
      heroHeight="38vh"
      heroTopRight={
        <a
          href="/user/profile"
          style={{
            color: "#6b7280",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ← Back to Profile
        </a>
      }
      avatarSlot={avatar}
      stats={[
        {
          label: "Profile Picture",
          value: (
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
                    style={{
                      color: "#6b7280",
                      fontSize: 13,
                      fontFamily: "'Georgia', serif",
                    }}
                  />
                  {errors.image && (
                    <p style={styles.errorText}>{errors.image.message}</p>
                  )}
                </div>
              )}
            />
          ),
        },
      ]}
    >
      <DarkSection eyebrow="Update Details" title="Personal Info">
        {error && (
          <div
            style={{
              marginBottom: "2rem",
              padding: "1rem 1.25rem",
              border: "1px solid #7f1d1d",
              background: "#1a0a0a",
              color: "#ef4444",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ borderTop: "1px solid #1a1a1a" }}>
            {/* Full Name */}
            <div style={styles.row}>
              <label
                style={{ ...styles.eyebrow, paddingTop: "0.9rem" }}
                htmlFor="fullName"
              >
                Full Name
              </label>
              <DarkInput
                id="fullName"
                placeholder="Enter your full name"
                registration={register("fullName")}
                error={errors.fullName?.message}
              />
            </div>

            {/* Username */}
            <div style={styles.row}>
              <label
                style={{ ...styles.eyebrow, paddingTop: "0.9rem" }}
                htmlFor="username"
              >
                Username
              </label>
              <DarkInput
                id="username"
                placeholder="Enter your username"
                registration={register("username")}
                error={errors.username?.message}
              />
            </div>

            {/* Email */}
            <div style={styles.row}>
              <label
                style={{ ...styles.eyebrow, paddingTop: "0.9rem" }}
                htmlFor="email"
              >
                Email Address
              </label>
              <DarkInput
                id="email"
                type="email"
                placeholder="Enter your email"
                registration={register("email")}
                error={errors.email?.message}
              />
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
            <DarkButton href="/user/profile" variant="outline">
              Cancel
            </DarkButton>
            <DarkButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </DarkButton>
          </div>
        </form>
      </DarkSection>
    </DarkPageLayout>
  );
}
