"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      const response = await handleResetPassword(token, data.password);
      if (response.success) {
        toast.success("Password reset successfully");
        // Redirect to login page
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      // Handle error
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div>
      <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Link
            href="/login"
            className="text-sm text-blue-500 hover:underline mb-4 inline-block"
          >
            Back to Login
          </Link>
          <Link
            href="/request-password-reset"
            className="text-sm text-blue-500 hover:underline mb-4 inline-block ml-4"
          >
            Request another reset email
          </Link>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
