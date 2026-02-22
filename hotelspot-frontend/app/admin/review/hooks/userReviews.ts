"use client";
import {
  handleDeleteReview,
  handleGetAllReviews,
  handleGetReviewAnalytics,
  handleUpdateReview,
} from "@/lib/actions/admin/review-action";
import { useState, useEffect, useCallback } from "react";
import { IReview } from "../schema";

export interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  reviewsByRating: Record<number, number>;
}

export interface ToastState {
  message: string;
  type: "success" | "error";
}

export interface UseReviewsReturn {
  // Data
  reviews: IReview[];
  stats: ReviewStats | null;
  pagination: PaginationInfo;
  // Loading states
  loading: boolean;
  statsLoading: boolean;
  // Search & filters
  searchInput: string;
  setSearchInput: (val: string) => void;
  ratingFilter: number;
  setRatingFilter: (val: number) => void;
  // Actions
  fetchReviews: (page?: number, searchVal?: string) => Promise<void>;
  updateReview: (id: string, formData: FormData) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
  // Toast
  toast: ToastState | null;
  dismissToast: () => void;
}

//  Hook

export function useReviews(): UseReviewsReturn {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<ToastState | null>(null);

  //  Helpers

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  //  Fetch reviews

  const fetchReviews = useCallback(
    async (page = 1, searchVal: string = search): Promise<void> => {
      setLoading(true);
      try {
        const res = await handleGetAllReviews(
          String(page),
          String(pagination.size),
          searchVal || undefined,
        );
        if (res.success) {
          setReviews((res.data as IReview[]) || []);
          setPagination((prev) => ({
            ...prev,
            ...(res.pagination ?? {}),
            page,
          }));
        } else {
          showToast(res.message || "Failed to load reviews", "error");
        }
      } catch {
        showToast("Unexpected error loading reviews", "error");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, pagination.size],
  );

  //  Fetch analytics

  const fetchStats = async (): Promise<void> => {
    setStatsLoading(true);
    try {
      const res = await handleGetReviewAnalytics();
      if (res.success) setStats(res.data as ReviewStats);
    } catch {
      // silently fail for stats
    } finally {
      setStatsLoading(false);
    }
  };

  // ── Initial load

  useEffect(() => {
    fetchReviews(1);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced search

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      fetchReviews(1, searchInput);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  //  Update

  const updateReview = async (
    id: string,
    formData: FormData,
  ): Promise<boolean> => {
    try {
      const res = await handleUpdateReview(id, formData);
      if (res.success) {
        showToast("Review updated successfully");
        await fetchReviews(pagination.page);
        await fetchStats();
        return true;
      }
      showToast(res.message || "Update failed", "error");
      return false;
    } catch {
      showToast("Unexpected error updating review", "error");
      return false;
    }
  };

  //  Delete

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      const res = await handleDeleteReview(id);
      if (res.success) {
        showToast("Review deleted successfully");
        await fetchReviews(pagination.page);
        await fetchStats();
        return true;
      }
      showToast(res.message || "Delete failed", "error");
      return false;
    } catch {
      showToast("Unexpected error deleting review", "error");
      return false;
    }
  };

  // Client-side rating filter

  const filteredReviews =
    ratingFilter > 0
      ? reviews.filter((r) => r.rating === ratingFilter)
      : reviews;

  // ── Return

  return {
    reviews: filteredReviews,
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
    dismissToast: () => setToast(null),
  };
}
