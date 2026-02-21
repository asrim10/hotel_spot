"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Stars } from "./Stars";
import { handleCreateReview } from "@/lib/actions/review-action";
import { ReviewCreateData } from "@/app/user/review/schema";

interface ReviewModalProps {
  hotelId: string;
  hotelName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewModal({
  hotelId,
  hotelName,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { comment: "" } });

  const onSubmit = async (data: any) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const payload: ReviewCreateData = {
      hotelId,
      rating,
      comment: data.comment,
    };
    const result = await handleCreateReview(payload);
    setSubmitting(false);
    if (result.success) {
      toast.success("Review submitted!");
      onSuccess();
      onClose();
    } else toast.error(result.message);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0f0f] border border-[#1f1f1f] max-w-lg w-full p-12 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#4b5563] hover:text-white transition-colors text-xl bg-transparent border-none cursor-pointer"
        >
          ✕
        </button>

        <p className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase mb-2">
          Guest Review
        </p>
        <h2
          className="text-white text-[22px] font-bold uppercase mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Rate Your Stay
        </h2>
        <p className="text-[#4b5563] text-sm mb-10">{hotelName}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div>
            <p className="text-[#6b7280] text-[11px] tracking-[0.15em] uppercase mb-3">
              Your Rating
            </p>
            <Stars value={rating} onChange={setRating} size={32} />
          </div>
          <div>
            <p className="text-[#6b7280] text-[11px] tracking-[0.15em] uppercase mb-2">
              Your Review
            </p>
            <textarea
              {...register("comment", {
                required: "Review is required",
                minLength: { value: 5, message: "Min 5 characters" },
                maxLength: { value: 1000, message: "Max 1000 characters" },
              })}
              rows={5}
              placeholder="Share the details of your stay..."
              className="w-full bg-transparent border border-[#1f1f1f] text-[#9ca3af] text-sm leading-relaxed p-3 outline-none resize-none focus:border-[#c9a96e] transition-colors"
            />
            {errors.comment && (
              <p className="text-[#ef4444] text-[11px] mt-1">
                {errors.comment.message as string}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="self-start bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.2em] uppercase font-bold px-10 py-4 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
