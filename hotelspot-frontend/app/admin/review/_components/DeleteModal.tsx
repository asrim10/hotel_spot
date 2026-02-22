"use client";

import { IReview } from "../schema";

interface DeleteModalProps {
  review: IReview;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteModal = ({
  review,
  onClose,
  onConfirm,
  loading,
}: DeleteModalProps) => (
  <div
    className="fixed inset-0 z-1000 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-95 rounded-xl border border-red-500/15 bg-[#0d0d0d] p-8 text-center shadow-2xl">
      <div className="mx-auto mb-5 w-14 h-14 flex items-center justify-center rounded-full border border-red-500/20 bg-red-500/8 text-2xl">
        🗑️
      </div>

      <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#6b6b8a]">
        Admin Panel
      </p>
      <h2
        className="mb-3 text-2xl font-bold text-white"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Delete Review
      </h2>
      <p className="mb-1 text-sm text-white/50 leading-relaxed">
        Permanently delete the review by
      </p>
      <p
        className="mb-5 text-base font-semibold text-[#C9A84C]"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {review.fullName}
      </p>
      <p className="mb-7 text-xs text-[#6b6b8a]">
        This action cannot be undone.
      </p>

      <div className="flex gap-2.5">
        <button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-white/8 bg-transparent text-sm text-[#6b6b8a] hover:border-white/20 hover:text-white/60 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg border border-red-500/25 bg-red-500/8text-sm text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
