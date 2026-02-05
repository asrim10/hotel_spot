// app/(auth)/_components/RequestPasswordResetForm.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordReset } from "@/lib/api/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import z from "zod";

export const RequestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type RequestPasswordResetDTO = z.infer<
  typeof RequestPasswordResetSchema
>;

export default function RequestPasswordResetForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordResetDTO>({
    resolver: zodResolver(RequestPasswordResetSchema),
  });

  const onSubmit = async (data: RequestPasswordResetDTO) => {
    try {
      const response = await requestPasswordReset(data.email);
      if (response.success) {
        toast.success("Password reset link sent to your email.");
        setIsSubmitted(true);
      } else {
        toast.error(response.message || "Failed to request password reset.");
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to request password reset.",
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 text-white text-sm font-medium mb-4">
          <svg
            width="18"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 11L12 3L21 11V20H3V11Z"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Hotelspot
        </div>
        <h2 className="text-3xl font-serif mt-4 mb-4 text-gray-800 dark:text-white">
          Check Your Email
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          If an account exists with that email, we've sent password reset
          instructions.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 text-white text-sm font-medium">
          <svg
            width="18"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 11L12 3L21 11V20H3V11Z"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Hotelspot
        </div>
        <h2 className="text-3xl font-serif mt-4 text-gray-800 dark:text-white">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Enter your email to receive a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            {...register("email")}
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 w-full rounded-md bg-black text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
