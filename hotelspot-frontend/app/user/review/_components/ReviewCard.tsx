"use client";
import { useState } from "react";
import { Stars } from "./Stars";
import { getImageUrl } from "./utils";
import {
  handleUpdateReview,
  handleDeleteReview,
} from "@/lib/actions/review-action";
import { toast } from "react-toastify";
import { ReviewUpdateData } from "@/app/user/review/schema";

interface ReviewData {
  _id?: string;
  id?: string;
  hotelId?: {
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

interface ReviewCardProps {
  review: ReviewData;
  onDeleted: (id: string) => void;
  onUpdated: (r: ReviewData) => void;
}

export function ReviewCard({ review, onDeleted, onUpdated }: ReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const id = review._id || review.id || "";
  const hotel = review.hotelId?.hotelName || review.hotelName || "Hotel";
  const location = [review.hotelId?.city, review.hotelId?.country]
    .filter(Boolean)
    .join(", ");
  const imageUrl = getImageUrl(review.hotelId?.imageUrl);
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const save = async () => {
    setSaving(true);
    const data: ReviewUpdateData = { rating: editRating, comment: editComment };
    const result = await handleUpdateReview(id, data);
    setSaving(false);
    if (result.success) {
      toast.success("Review updated");
      onUpdated({ ...review, rating: editRating, comment: editComment });
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
    <div style={{ borderTop: "1px solid #1f1f1f", padding: "2.5rem 0" }}>
      {/* Hotel image + meta header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          gap: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            height: 110,
            overflow: "hidden",
            background: "#111",
            flexShrink: 0,
          }}
        >
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={hotel}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #1a1a0f, #111)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#2a2a2a", fontSize: 28 }}>⌂</span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "0.4rem",
          }}
        >
          {location && (
            <p
              style={{
                color: "#c9a96e",
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {location}
            </p>
          )}
          <h3
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 700,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {hotel}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Stars
              value={editing ? editRating : review.rating}
              onChange={editing ? setEditRating : undefined}
              size={15}
            />
            <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>{date}</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    fontSize: 11,
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
                    fontSize: 11,
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
                    fontSize: 11,
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
                    fontSize: 11,
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
      </div>

      {/* Comment content */}
      <div style={{ paddingLeft: "calc(180px + 2rem)" }}>
        {editing ? (
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={4}
            style={{
              background: "transparent",
              border: "1px solid #222",
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
