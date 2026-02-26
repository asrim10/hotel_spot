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

function DeleteModal({
  onConfirm,
  onCancel,
  deleting,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />
      <div className="relative bg-[#0d0d0d] border border-[#1a1a1a] w-[90%] max-w-md p-8">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-[#6b7280] hover:text-white bg-transparent border-none cursor-pointer text-lg leading-none"
        >
          ✕
        </button>
        <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
          Confirm Action
        </p>
        <h2
          className="text-white text-2xl font-bold uppercase mb-5 m-0"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Delete Review
        </h2>
        <p className="text-[#9ca3af] text-sm leading-relaxed mb-8">
          Are you sure you want to delete this review? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#2a2a2a] bg-transparent text-[#9ca3af] text-[11px] tracking-[0.14em] uppercase py-3 cursor-pointer hover:border-[#3a3a3a] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-[#7f1d1d] border border-[#7f1d1d] text-white text-[11px] tracking-[0.14em] uppercase font-bold py-3 cursor-pointer hover:bg-red-900 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReviewCard({
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
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 👈 new

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
    const result = await handleUpdateReview(id, {
      rating: editRating,
      comment: editComment,
    } as ReviewUpdateData);
    setSaving(false);
    if (result.success) {
      toast.success("Review updated");
      onUpdated({ ...review, rating: editRating, comment: editComment });
      setEditing(false);
    } else toast.error(result.message);
  };

  const del = async () => {
    setDeleting(true);
    const result = await handleDeleteReview(id);
    setDeleting(false);
    setShowDeleteModal(false);
    if (result.success) {
      toast.success("Deleted");
      onDeleted(id);
    } else toast.error(result.message);
  };

  const actionBtnCls =
    "bg-transparent border-none text-[11px] tracking-[0.1em] uppercase p-0 cursor-pointer transition-colors";

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onConfirm={del}
          onCancel={() => setShowDeleteModal(false)}
          deleting={deleting}
        />
      )}

      <div className="border-t border-[#1f1f1f] py-10">
        <div
          className="grid gap-8 mb-6"
          style={{ gridTemplateColumns: "180px 1fr" }}
        >
          <div className="h-27.5 overflow-hidden bg-[#111] shrink-0">
            {imageUrl && !imgError ? (
              <img
                src={imageUrl}
                alt={hotel}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1a1a0f, #111)" }}
              >
                <span className="text-[#2a2a2a] text-3xl">⌂</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-1.5">
            {location && (
              <p className="text-[#c9a96e] text-[11px] tracking-[0.15em] uppercase m-0">
                {location}
              </p>
            )}
            <h3
              className="text-white text-lg font-bold uppercase m-0"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {hotel}
            </h3>
            <div className="flex items-center gap-4">
              <Stars
                value={editing ? editRating : review.rating}
                onChange={editing ? setEditRating : undefined}
                size={15}
              />
              <p className="text-[#4b5563] text-xs m-0">{date}</p>
            </div>
            <div className="flex gap-4 mt-1">
              {!editing ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className={`${actionBtnCls} text-[#6b7280] hover:text-white`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deleting}
                    className={`${actionBtnCls} text-[#6b7280] hover:text-[#f87171] disabled:opacity-50`}
                  >
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={save}
                    disabled={saving}
                    className={`${actionBtnCls} text-[#c9a96e] hover:opacity-70 disabled:opacity-50`}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className={`${actionBtnCls} text-[#6b7280] hover:text-white`}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ paddingLeft: "calc(180px + 2rem)" }}>
          {editing ? (
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={4}
              className="w-full bg-transparent border border-[#222] text-[#9ca3af] text-sm leading-relaxed p-3 outline-none resize-none focus:border-[#c9a96e] transition-colors"
            />
          ) : (
            <p className="text-[#9ca3af] text-sm leading-relaxed m-0">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
