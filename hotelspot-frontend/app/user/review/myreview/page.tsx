"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  handleCreateReview,
  handleGetMyReviews,
  handleDeleteReview,
  handleUpdateReview,
} from "@/lib/actions/review-action";
import { useAuth } from "@/app/context/AuthContext";

/* ─── Types ─────────────────────────────────────────────── */
interface ReviewData {
  _id?: string;
  id?: string;
  hotel?: { hotelName?: string };
  hotelName?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt?: string;
}

/* ─── Star component ─────────────────────────────────────── */
function Stars({
  value,
  onChange,
  size = 32,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  const [hov, setHov] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const active = hov || value;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            onMouseEnter={() => onChange && setHov(s)}
            onMouseLeave={() => onChange && setHov(0)}
            style={{ cursor: onChange ? "pointer" : "default" }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={s <= active ? "#c9a96e" : "none"}
              stroke={s <= active ? "#c9a96e" : "#4b5563"}
              strokeWidth="1.5"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </button>
        ))}
      </div>
      {onChange && active > 0 && (
        <span
          style={{
            color: "#c9a96e",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {labels[active]}
        </span>
      )}
    </div>
  );
}

/* ─── Review Card ────────────────────────────────────────── */
function ReviewCard({
  review,
  onDeleted,
  onUpdated,
}: {
  review: ReviewData;
  onDeleted: (id: string) => void;
  onUpdated: (r: ReviewData) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const id = review._id || review.id || "";
  const hotel = review.hotel?.hotelName || review.hotelName || "Hotel";
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const save = async () => {
    setSaving(true);
    const result = await handleUpdateReview(id, {
      rating: editRating,
      comment: editComment,
    });
    setSaving(false);
    if (result.success) {
      toast.success("Review updated");
      onUpdated({
        ...review,
        rating: editRating,
        title: editTitle,
        comment: editComment,
      });
      setEditing(false);
    } else toast.error(result.message);
  };

  const del = async () => {
    if (!confirm("Delete this review?")) return;
    setDeleting(true);
    const result = await handleDeleteReview(id);
    setDeleting(false);
    if (result.success) {
      toast.success("Deleted");
      onDeleted(id);
    } else toast.error(result.message);
  };

  return (
    <div
      style={{
        borderTop: "1px solid #1f1f1f",
        padding: "2.5rem 0",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "3rem",
      }}
    >
      {/* Left meta */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <p
          style={{
            color: "#c9a96e",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {hotel}
        </p>
        <Stars
          value={editing ? editRating : review.rating}
          onChange={editing ? setEditRating : undefined}
          size={18}
        />
        <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>{date}</p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          {!editing ? (
            <>
              <button
                onClick={() => setEditing(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                Edit
              </button>
              <button
                onClick={del}
                disabled={deleting}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                {deleting ? "..." : "Delete"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={save}
                disabled={saving}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c9a96e",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: 0,
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Right content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {editing ? (
          <>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #333",
                color: "#fff",
                fontSize: 20,
                fontFamily: "inherit",
                fontWeight: 600,
                padding: "0.25rem 0",
                outline: "none",
                width: "100%",
              }}
            />
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              style={{
                background: "transparent",
                border: "1px solid #222",
                borderRadius: 4,
                color: "#9ca3af",
                fontSize: 14,
                fontFamily: "inherit",
                lineHeight: 1.7,
                padding: "0.75rem",
                outline: "none",
                resize: "none",
                width: "100%",
              }}
            />
          </>
        ) : (
          <>
            <h3
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {review.title}
            </h3>
            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {review.comment}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function ReviewsPage() {
  const searchParams = useSearchParams();
  const hotelId = searchParams.get("hotelId") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const { user } = useAuth();

  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"write" | "my">(
    hotelId && bookingId ? "write" : "my",
  );
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", comment: "" },
  });

  useEffect(() => {
    if (!user) return;
    handleGetMyReviews()
      .then((r) => {
        setReviews(r.success && Array.isArray(r.data) ? r.data : []);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const onSubmit = async (data: any) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const result = await handleCreateReview({
      ...data,
      rating,
      hotelId,
      bookingId,
    });
    setSubmitting(false);
    if (result.success) {
      toast.success("Review submitted");
      reset();
      setRating(0);
      setTab("my");
      const r = await handleGetMyReviews();
      if (r.success) setReviews(r.data);
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
        {/* Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0d1117 0%, #1a1a0f 40%, #0f0f0f 100%)",
          }}
        />
        {/* Decorative orbs matching the reference */}
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
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
          }}
        />
        {/* Top-right secondary headline */}
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
        {/* Main headline */}
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

      {/* ── STATS BAR ────────────────────────────────────── */}
      {reviews.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
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
              label: "Positive Stays",
              value: reviews.filter((r) => r.rating >= 4).length,
            },
          ].map((stat, i) => (
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
                {stat.label}
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 32,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {stat.value}
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
        {hotelId && bookingId && (
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
              transition: "color 0.2s",
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
            transition: "color 0.2s",
          }}
        >
          My Reviews {reviews.length > 0 && `(${reviews.length})`}
        </button>
      </div>

      {/* ── WRITE REVIEW ─────────────────────────────────── */}
      {tab === "write" && hotelId && bookingId && (
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
              {/* Rating */}
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

              {/* Title */}
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
                  Review Title
                </p>
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: { value: 3, message: "Min 3 characters" },
                  })}
                  placeholder="Summarize your stay..."
                  style={{ ...inputStyle, fontSize: 18 }}
                />
                {errors.title && (
                  <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              {/* Comment */}
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
                    minLength: { value: 10, message: "Min 10 characters" },
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

              {/* Submit — matches the beige/tan CTA from reference */}
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
                    transition: "opacity 0.2s",
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
            /* Empty state — matches the 3-col principles layout from reference */
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
                        "Your honest feedback helps us improve and helps fellow travelers make better decisions about their stay.",
                        "Rate your experience from 1 to 5 stars and tell the world what made your visit memorable.",
                        "Every review contributes to a community of informed travelers seeking the perfect hotel experience.",
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
