"use client";

import { useEffect, useState } from "react";
import { getMyBookings } from "@/lib/api/booking";
import { getHotelById } from "@/lib/api/hotel";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import BookingHeader from "../_components/BookingHeader";
import SearchFilterBar from "../_components/SearchFilter";
import BookingTabs from "../_components/BookingTabs";
import BookingCard from "../_components/BookingCard";
import EmptyState from "../_components/EmptyState";
import BookingSummaryStats from "../_components/BookingSummary";
import ReviewModal from "../_components/ReviewModal";
import { getLocationString } from "../bookingUtils";

export default function BookingHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hotelCache, setHotelCache] = useState<Record<string, any>>({});
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const { user } = useAuth();

  const getHotelData = (booking: any) =>
    booking.hotel || hotelCache[booking.hotelId] || {};

  const filterBookings = () => {
    let filtered = bookings;

    if (activeTab !== "all") {
      filtered = filtered.filter((b) => b.status === activeTab);
    }

    if (searchQuery) {
      filtered = filtered.filter((booking) => {
        const hotelData = getHotelData(booking);
        const hotelName = hotelData?.hotelName || booking.hotelName || "";
        const location = getLocationString(hotelData);
        const id = booking._id || booking.id || "";
        return (
          hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          id.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    return filtered;
  };

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getMyBookings()
      .then((res: any) => {
        if (res?.success && Array.isArray(res.data)) setBookings(res.data);
        else if (Array.isArray(res)) setBookings(res);
        else setBookings([]);
      })
      .catch((err: any) => {
        toast.error(err.message || "Failed to load bookings");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!bookings.length) return;
    bookings.forEach((booking) => {
      if (!booking.hotel && booking.hotelId && !hotelCache[booking.hotelId]) {
        getHotelById(booking.hotelId)
          .then((res: any) => {
            const hotelData = res?.success ? res.data : res;
            if (hotelData) {
              setHotelCache((prev) => ({
                ...prev,
                [booking.hotelId]: hotelData,
              }));
            }
          })
          .catch((err: any) =>
            console.error(`Failed to fetch hotel ${booking.hotelId}:`, err),
          );
      }
    });
  }, [bookings]);

  const handleReviewSubmit = (
    bookingId: string,
    rating: number,
    review: string,
  ) => {
    // TODO: call your review API here
    console.log("Review submitted:", { bookingId, rating, review });
    toast.success("Review submitted successfully!");
    // Optimistically update local rating
    setBookings((prev) =>
      prev.map((b) => ((b._id || b.id) === bookingId ? { ...b, rating } : b)),
    );
  };

  const filteredBookings = filterBookings();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <BookingHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                hotelData={getHotelData(booking)}
                onReview={setReviewBooking}
              />
            ))}
          </div>
        )}

        <BookingSummaryStats bookings={bookings} />
      </div>

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          hotelName={
            getHotelData(reviewBooking)?.hotelName ||
            reviewBooking.hotelName ||
            "Hotel"
          }
          onClose={() => setReviewBooking(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
