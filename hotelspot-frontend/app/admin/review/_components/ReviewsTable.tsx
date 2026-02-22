"use client";
import StarRating from "./StarRating";
import Avatar from "./Avatar";
import ReviewBadge from "./Badge";
import { IReview } from "../schema";
import SkeletonRow from "./SekeletonRow";

type BadgeVariant = "success" | "gold" | "danger";

const ratingVariant = (r: number): BadgeVariant =>
  r >= 4 ? "success" : r === 3 ? "gold" : "danger";

interface ReviewsTableProps {
  reviews: IReview[];
  loading: boolean;
  onView: (r: IReview) => void;
  onEdit: (r: IReview) => void;
  onDelete: (r: IReview) => void;
}

const COL = "2fr 1.5fr 2fr 1fr 0.8fr 90px";

const HEADS = ["Guest", "Hotel", "Comment", "Rating", "Date", "Actions"];

const ReviewsTable = ({
  reviews,
  loading,
  onView,
  onEdit,
  onDelete,
}: ReviewsTableProps) => (
  <div className="rounded-xl border border-white/8 overflow-hidden">
    {/* Head */}
    <div
      className="grid gap-4 px-6 py-3 border-b border-white/8 bg-white/2"
      style={{ gridTemplateColumns: COL }}
    >
      {HEADS.map((h) => (
        <span
          key={h}
          className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a]"
        >
          {h}
        </span>
      ))}
    </div>

    {/* Body */}
    {loading ? (
      Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} index={i} />)
    ) : reviews.length === 0 ? (
      <div className="py-20 text-center">
        <p className="text-4xl mb-3 opacity-30">✦</p>
        <p className="text-sm text-[#6b6b8a] uppercase tracking-widest">
          No reviews found
        </p>
      </div>
    ) : (
      reviews.map((review, i) => (
        <div
          key={review._id}
          className="grid gap-4 px-6 py-4 items-center border-b border-white/4 last:border-none hover:bg-white/2.5 transition-colors duration-150 group"
          style={{ gridTemplateColumns: COL }}
        >
          {/* Guest */}
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={review.fullName} />
            <div className="min-w-0">
              <p className="text-sm text-white/80 font-medium truncate">
                {review.fullName}
              </p>
              <p className="text-xs text-[#6b6b8a] truncate mt-0.5">
                {review.email}
              </p>
            </div>
          </div>

          {/* Hotel */}
          <p className="text-sm text-white/60 truncate">
            {typeof review.hotelId === "object" && review.hotelId !== null
              ? ((review.hotelId as { hotelName?: string }).hotelName ?? "—")
              : "—"}
          </p>

          {/* Comment */}
          <p
            className="text-xs text-[#6b6b8a] leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {review.comment}
          </p>

          {/* Rating */}
          <div className="flex flex-col gap-1.5">
            <StarRating rating={review.rating} size={11} />
            <ReviewBadge variant={ratingVariant(review.rating)}>
              {review.rating}/5
            </ReviewBadge>
          </div>

          {/* Date */}
          <p className="text-xs text-[#6b6b8a]">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Actions */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {[
              { icon: "👁️", label: "View", fn: () => onView(review) },
              { icon: "✏️", label: "Edit", fn: () => onEdit(review) },
              { icon: "🗑️", label: "Delete", fn: () => onDelete(review) },
            ].map(({ icon, label, fn }) => (
              <button
                key={label}
                title={label}
                onClick={fn}
                className="w-7 h-7 rounded-lg border border-white/8 bg-white/4 flex items-center justify-center text-xs hover:border-white/20 hover:bg-white/8 transition-all duration-150 cursor-pointer"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
      ))
    )}
  </div>
);

export default ReviewsTable;
