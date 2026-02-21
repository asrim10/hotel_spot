"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  handleCreateReview,
  handleGetMyReviews,
} from "@/lib/actions/review-action";
import { useAuth } from "@/app/context/AuthContext";
import { ReviewCreateData } from "@/app/user/review/schema";
import { Stars } from "../_components/Stars";
import { ReviewCard } from "../_components/ReviewCard";

interface ReviewData {
  _id?: string;
  id?: string;
  hotel?: {
    _id?: string;
    hotelName?: string;
    imageUrl?: string;
    city?: string;
    country?: string;
  };
  hotelName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

const DOTS = [
  { top: "30%", left: "20%" },
  { top: "55%", left: "45%" },
  { top: "25%", right: "30%" },
  { top: "60%", right: "15%" },
];

const EMPTY_COLS = [
  {
    title: "Share Your Stay",
    body: "Your honest feedback helps us improve and helps fellow travelers make better decisions.",
  },
  {
    title: "Rate Your Experience",
    body: "Rate from 1 to 5 stars and tell the world what made your visit memorable.",
  },
  {
    title: "Help Others Choose",
    body: "Every review contributes to a community of informed travelers.",
  },
];

export default function MyReviewsPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId") || "";
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"write" | "my">(hotelId ? "write" : "my");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { comment: "" } });

  const fetchReviews = async () => {
    const r = await handleGetMyReviews();
    if (r.success) setReviews(Array.isArray(r.data) ? r.data : []);
  };

  useEffect(() => {
    if (!user) return;
    fetchReviews().finally(() => setLoading(false));
  }, [user]);

  const onSubmit = async (data: any) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const result = await handleCreateReview({
      hotelId,
      rating,
      comment: data.comment,
    } as ReviewCreateData);
    setSubmitting(false);
    if (result.success) {
      toast.success("Review submitted");
      reset();
      setRating(0);
      setTab("my");
      fetchReviews();
    } else toast.error(result.message);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p
          className="text-[#c9a96e] text-lg"
          style={{ fontFamily: "Georgia, serif" }}
        >
          You must be logged in to view your reviews.
        </p>
      </div>
    );
  }

  if (tab === "write" && !hotelId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center" style={{ fontFamily: "Georgia, serif" }}>
          <h2 className="text-[#c9a96e] mb-4">No Hotel Selected</h2>
          <p className="text-[#aaa]">
            Please select a hotel to write a review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* HERO */}
      <div
        className="relative flex items-end overflow-hidden"
        style={{ height: "55vh", minHeight: 400 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0d1117 0%, #1a1a0f 40%, #0f0f0f 100%)",
          }}
        />
        {DOTS.map((pos, i) => (
          <div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full bg-white opacity-60"
            style={{ ...pos, boxShadow: "0 0 20px 4px rgba(255,255,255,0.3)" }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
          }}
        />
        <div className="absolute top-[28%] right-[8%] text-right">
          <p className="text-[#c9a96e] text-sm tracking-[0.2em] uppercase mb-2">
            Your Experience
          </p>
          <h2 className="text-white text-[clamp(18px,3vw,28px)] font-light leading-snug tracking-[0.05em] m-0">
            MATTERS
            <br />
            TO US
          </h2>
        </div>
        <div className="relative z-10 px-[5%] pb-16">
          <p className="text-[#c9a96e] text-xs tracking-[0.2em] uppercase mb-4">
            Guest Reviews
          </p>
          <h1 className="text-[clamp(32px,6vw,72px)] font-bold leading-tight uppercase tracking-tight m-0">
            SHARE YOUR
            <br />
            STAY
          </h1>
        </div>
      </div>

      {/* STATS */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-3 border-t border-b border-[#1a1a1a]">
          {[
            { label: "Total Reviews", value: reviews.length },
            {
              label: "Average Rating",
              value: avgRating ? `${avgRating} / 5` : "—",
            },
            {
              label: "Hotels Reviewed",
              value: new Set(reviews.map((r) => r.hotel?._id || r.hotelName))
                .size,
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`px-[5%] py-8 ${i < 2 ? "border-r border-[#1a1a1a]" : ""}`}
            >
              <p className="text-[#c9a96e] text-[11px] tracking-[0.18em] uppercase mb-2">
                {s.label}
              </p>
              <p className="text-white text-[32px] font-bold m-0">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div className="px-[5%] pt-12 pb-0 border-b border-[#1a1a1a] flex gap-12">
        {hotelId && (
          <button
            onClick={() => setTab("write")}
            className={`bg-transparent border-none cursor-pointer text-[11px] tracking-[0.2em] uppercase pb-4 transition-colors border-b ${
              tab === "write"
                ? "text-[#c9a96e] border-[#c9a96e]"
                : "text-[#4b5563] border-transparent"
            }`}
          >
            Write a Review
          </button>
        )}
        <button
          onClick={() => setTab("my")}
          className={`bg-transparent border-none cursor-pointer text-[11px] tracking-[0.2em] uppercase pb-4 transition-colors border-b ${
            tab === "my"
              ? "text-[#c9a96e] border-[#c9a96e]"
              : "text-[#4b5563] border-transparent"
          }`}
        >
          My Reviews {reviews.length > 0 && `(${reviews.length})`}
        </button>
      </div>

      {/* WRITE REVIEW */}
      {tab === "write" && hotelId && (
        <div className="px-[5%] py-16">
          <div className="max-w-2xl">
            <p className="text-[#c9a96e] text-[11px] tracking-[0.18em] uppercase mb-12">
              Share Your Experience
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-10"
            >
              <div>
                <p className="text-[#6b7280] text-[11px] tracking-[0.15em] uppercase mb-4">
                  Your Rating
                </p>
                <Stars value={rating} onChange={setRating} size={36} />
              </div>
              <div>
                <p className="text-[#6b7280] text-[11px] tracking-[0.15em] uppercase mb-3">
                  Your Review
                </p>
                <textarea
                  {...register("comment", {
                    required: "Review is required",
                    minLength: { value: 5, message: "Min 5 characters" },
                    maxLength: { value: 1000, message: "Max 1000 characters" },
                  })}
                  rows={6}
                  placeholder="Describe your experience in detail..."
                  className="w-full bg-transparent border border-[#1f1f1f] text-[#9ca3af] text-sm leading-relaxed p-4 outline-none resize-none focus:border-[#c9a96e] transition-colors"
                />
                {errors.comment && (
                  <p className="text-[#ef4444] text-xs mt-1.5">
                    {errors.comment.message as string}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="self-start bg-[#c9a96e] text-[#0a0a0a] text-[11px] tracking-[0.2em] uppercase font-bold px-10 py-4 border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MY REVIEWS */}
      {tab === "my" && (
        <div className="px-[5%] py-16">
          <p className="text-[#c9a96e] text-[11px] tracking-[0.18em] uppercase mb-4">
            Your Feedback
          </p>
          <h2 className="text-white text-[clamp(24px,4vw,48px)] font-bold uppercase mb-12 leading-tight">
            MY REVIEWS
          </h2>
          {loading ? (
            <p className="text-[#4b5563] text-sm">Loading...</p>
          ) : reviews.length === 0 ? (
            <div className="grid grid-cols-3 border-t border-[#1a1a1a]">
              {EMPTY_COLS.map(({ title, body }, i) => (
                <div
                  key={i}
                  className={`py-10 ${i > 0 ? "pl-8 border-l border-[#1a1a1a]" : "pr-8"}`}
                >
                  <p className="text-[#c9a96e] text-[11px] tracking-[0.15em] uppercase mb-4">
                    {title}
                  </p>
                  <p className="text-[#6b7280] text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id || review.id}
                  review={review}
                  onDeleted={(id) =>
                    setReviews((prev) =>
                      prev.filter((r) => (r._id || r.id) !== id),
                    )
                  }
                  onUpdated={(updated) =>
                    setReviews((prev) =>
                      prev.map((r) =>
                        (r._id || r.id) === (updated._id || updated.id)
                          ? updated
                          : r,
                      ),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
