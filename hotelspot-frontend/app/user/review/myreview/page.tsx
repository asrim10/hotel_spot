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
  } = useForm({
    defaultValues: { comment: "" },
  });

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
    const payload: ReviewCreateData = {
      hotelId,
      rating,
      comment: data.comment,
    };
    const result = await handleCreateReview(payload);
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

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #2a2a2a",
    color: "#fff",
    fontSize: 15,
    fontFamily: "inherit",
    padding: "0.75rem 0",
    outline: "none",
    width: "100%",
    letterSpacing: "0.02em",
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <p
          style={{
            fontSize: 18,
            color: "#c9a96e",
            fontFamily: "Georgia, serif",
          }}
        >
          You must be logged in to view your reviews.
        </p>
      </div>
    );
  }

  if (tab === "write" && !hotelId) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div style={{ textAlign: "center", fontFamily: "Georgia, serif" }}>
          <h2 style={{ color: "#c9a96e", marginBottom: 16 }}>
            No Hotel Selected
          </h2>
          <p style={{ color: "#aaa" }}>
            Please select a hotel to write a review.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: "55vh",
          minHeight: 400,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0d1117 0%, #1a1a0f 40%, #0f0f0f 100%)",
          }}
        />
        {[
          { top: "30%", left: "20%" },
          { top: "55%", left: "45%" },
          { top: "25%", right: "30%" },
          { top: "60%", right: "15%" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...(pos as any),
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#fff",
              opacity: 0.6,
              boxShadow: "0 0 20px 4px rgba(255,255,255,0.3)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "28%",
            right: "8%",
            textAlign: "right",
          }}
        >
          <p
            style={{
              color: "#c9a96e",
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 0.5rem",
            }}
          >
            Your Experience
          </p>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(18px,3vw,28px)",
              fontWeight: 300,
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: "0.05em",
            }}
          >
            MATTERS
            <br />
            TO US
          </h2>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "0 5% 4rem" }}>
          <p
            style={{
              color: "#c9a96e",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 1rem",
            }}
          >
            Guest Reviews
          </p>
          <h1
            style={{
              fontSize: "clamp(32px,6vw,72px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            SHARE YOUR
            <br />
            STAY
          </h1>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            borderTop: "1px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
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
              style={{
                padding: "2rem 5%",
                borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
              }}
            >
              <p
                style={{
                  color: "#c9a96e",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  margin: "0 0 0.5rem",
                }}
              >
                {s.label}
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── TABS ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "3rem 5% 0",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          gap: "3rem",
        }}
      >
        {hotelId && (
          <button
            onClick={() => setTab("write")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === "write" ? "#c9a96e" : "#4b5563",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              paddingBottom: "1rem",
              borderBottom:
                tab === "write" ? "1px solid #c9a96e" : "1px solid transparent",
            }}
          >
            Write a Review
          </button>
        )}
        <button
          onClick={() => setTab("my")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: tab === "my" ? "#c9a96e" : "#4b5563",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            paddingBottom: "1rem",
            borderBottom:
              tab === "my" ? "1px solid #c9a96e" : "1px solid transparent",
          }}
        >
          My Reviews {reviews.length > 0 && `(${reviews.length})`}
        </button>
      </div>

      {/* ── WRITE REVIEW ─────────────────────────────────── */}
      {tab === "write" && hotelId && (
        <div style={{ padding: "4rem 5%" }}>
          <div style={{ maxWidth: 720 }}>
            <p
              style={{
                color: "#c9a96e",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: "3rem",
              }}
            >
              Share Your Experience
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "1rem",
                  }}
                >
                  Your Rating
                </p>
                <Stars value={rating} onChange={setRating} size={36} />
              </div>
              <div>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: 11,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
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
                  style={{
                    ...inputStyle,
                    borderBottom: "none",
                    border: "1px solid #1f1f1f",
                    padding: "1rem",
                    resize: "none",
                    lineHeight: 1.8,
                  }}
                />
                {errors.comment && (
                  <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                    {errors.comment.message as string}
                  </p>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "#c9a96e",
                    border: "none",
                    color: "#0a0a0a",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    padding: "1rem 2.5rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MY REVIEWS ───────────────────────────────────── */}
      {tab === "my" && (
        <div style={{ padding: "4rem 5%" }}>
          <p
            style={{
              color: "#c9a96e",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Your Feedback
          </p>
          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(24px,4vw,48px)",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "3rem",
              lineHeight: 1.1,
            }}
          >
            MY REVIEWS
          </h2>
          {loading ? (
            <p style={{ color: "#4b5563", fontSize: 14 }}>Loading...</p>
          ) : reviews.length === 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 0,
                borderTop: "1px solid #1a1a1a",
              }}
            >
              {[
                "Share Your Stay",
                "Rate Your Experience",
                "Help Others Choose",
              ].map((title, i) => (
                <div
                  key={i}
                  style={{
                    padding: "2.5rem 2rem 2.5rem 0",
                    borderRight: i < 2 ? "1px solid #1a1a1a" : "none",
                    paddingLeft: i > 0 ? "2rem" : 0,
                  }}
                >
                  <p
                    style={{
                      color: "#c9a96e",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "1rem",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7 }}
                  >
                    {
                      [
                        "Your honest feedback helps us improve and helps fellow travelers make better decisions.",
                        "Rate from 1 to 5 stars and tell the world what made your visit memorable.",
                        "Every review contributes to a community of informed travelers.",
                      ][i]
                    }
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
