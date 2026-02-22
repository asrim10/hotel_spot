"use client";
import { useState } from "react";
import { useReviews } from "./hooks/userReviews";
import { IReview } from "./schema";
import ReviewsToolbar from "./_components/ReviewToolbar";
import ReviewsTable from "./_components/ReviewsTable";
import ReviewModal from "./_components/ReviewModal";
import ReviewsPagination from "./_components/ReviewPagination";
import DeleteModal from "./_components/DeleteModal";
import Toast from "./_components/Toast";
import StarRating from "./_components/StarRating";

export default function AdminReviewsPage() {
  const {
    reviews,
    stats,
    pagination,
    loading,
    statsLoading,
    searchInput,
    setSearchInput,
    ratingFilter,
    setRatingFilter,
    fetchReviews,
    updateReview,
    deleteReview,
    toast,
    dismissToast,
  } = useReviews();

  const [viewReview, setViewReview] = useState<IReview | null>(null);
  const [editReview, setEditReview] = useState<IReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IReview | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSave = async (id: string, formData: FormData) => {
    const ok = await updateReview(id, formData);
    if (ok) setEditReview(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const ok = await deleteReview(deleteTarget._id as string);
    if (ok) setDeleteTarget(null);
    setDeleteLoading(false);
  };

  // Stat cards config — mirrors the bookings page row
  const statCards = [
    { label: "Total", value: stats?.totalReviews ?? 0, accent: "#C9A84C" },
    {
      label: "5 Star",
      value: stats?.reviewsByRating?.[5] ?? 0,
      accent: "#51cf66",
    },
    {
      label: "4 Star",
      value: stats?.reviewsByRating?.[4] ?? 0,
      accent: "#74c0fc",
    },
    {
      label: "3 Star",
      value: stats?.reviewsByRating?.[3] ?? 0,
      accent: "#C9A84C",
    },
    {
      label: "2 Star",
      value: stats?.reviewsByRating?.[2] ?? 0,
      accent: "#ffa94d",
    },
    {
      label: "1 Star",
      value: stats?.reviewsByRating?.[1] ?? 0,
      accent: "#ff6b6b",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes slideInToast { from { transform:translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }
      `}</style>

      <div
        className="min-h-screen bg-[#0a0a0a] text-white px-10 py-10"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="max-w-350 mx-auto">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b6b8a] mb-2">
              Admin Panel
            </p>
            <div className="flex items-center justify-between">
              <h1
                className="text-[56px] font-bold leading-none tracking-tight text-white uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Reviews
              </h1>
              {/* Average rating badge — top right like the REFRESH button */}
              {!statsLoading && stats && (
                <button
                  onClick={() => fetchReviews(pagination.page)}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-white/8 bg-white/2 text-sm text-[#6b6b8a] hover:border-white/20 hover:text-white/70 transition-all cursor-pointer"
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="opacity-60"
                  >
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
                  </svg>
                  <span className="uppercase tracking-widest text-xs">
                    Refresh
                  </span>
                </button>
              )}
            </div>

            {/* Gold divider */}
            <div className="mt-6 h-px bg-white/6" />
          </div>

          {/* Average badge */}
          {!statsLoading && stats && (
            <div className="flex items-center gap-3 mb-8 w-fit">
              <StarRating rating={Math.round(stats.averageRating)} size={14} />
              <span className="text-sm text-[#C9A84C]">
                {stats.averageRating.toFixed(2)} average rating
              </span>
            </div>
          )}

          {/*  Toolbar  */}
          <ReviewsToolbar
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            ratingFilter={ratingFilter}
            onRatingFilterChange={setRatingFilter}
            total={pagination.total}
          />

          {/*  Table  */}
          <ReviewsTable
            reviews={reviews}
            loading={loading}
            onView={setViewReview}
            onEdit={setEditReview}
            onDelete={setDeleteTarget}
          />

          {/*  Pagination  */}
          <ReviewsPagination
            pagination={pagination}
            onPageChange={(p) => fetchReviews(p)}
          />
        </div>
      </div>

      {/*  Modals  */}
      {viewReview && (
        <ReviewModal
          review={viewReview}
          mode="view"
          onClose={() => setViewReview(null)}
        />
      )}
      {editReview && (
        <ReviewModal
          review={editReview}
          mode="edit"
          onClose={() => setEditReview(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

      {/*  Toast  */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}
    </>
  );
}
