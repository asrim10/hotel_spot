"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, loginSchema } from "../schema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();

  const submit = async (values: LoginData) => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/");
    });
    console.log("login", values);
  };

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
        <h2 className="text-3xl font-serif mt-4">Sign in to your account</h2>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("email")}
            placeholder="Enter your email"
          />
          {errors.email?.message && (
            <p className="text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("password")}
            placeholder="Enter your password"
          />
          {errors.password?.message && (
            <p className="text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || pending}
          className="h-10 w-full rounded-md bg-black text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
        >
          {isSubmitting || pending ? "Signing in..." : "Sign in"}
        </button>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-200 py-2 bg-black"
          >
            <FcGoogle /> Continue with Google
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-md border border-gray-200 py-2 bg-black"
          >
            <FaApple /> Continue with Apple
          </button>
        </div>
      </form>
    </div>
  );
}
