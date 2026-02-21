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
import BookingSummaryStats from "../_components/BookingSummary";
import { getLocationString } from "@/app/BookingUtils";

export default function BookingHistoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hotelCache, setHotelCache] = useState<Record<string, any>>({});
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);

  const getHotelData = (booking: any) =>
    booking.hotel || hotelCache[booking.hotelId] || {};

  const filterBookings = () => {
    let filtered = bookings;
    if (activeTab !== "all")
      filtered = filtered.filter((b) => b.status === activeTab);
    if (searchQuery) {
      filtered = filtered.filter((b) => {
        const h = getHotelData(b);
        const name = h?.hotelName || b.hotelName || "";
        const loc = getLocationString(h);
        const id = b._id || b.id || "";
        const q = searchQuery.toLowerCase();
        return (
          name.toLowerCase().includes(q) ||
          loc.toLowerCase().includes(q) ||
          id.toLowerCase().includes(q)
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
      .catch((e: any) => {
        toast.error(e.message || "Failed to load bookings");
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!bookings.length) return;
    bookings.forEach((b) => {
      if (!b.hotel && b.hotelId && !hotelCache[b.hotelId]) {
        getHotelById(b.hotelId)
          .then((res: any) => {
            const data = res?.success ? res.data : res;
            if (data) setHotelCache((prev) => ({ ...prev, [b.hotelId]: data }));
          })
          .catch(() => {});
      }
    });
  }, [bookings]);

  const filtered = filterBookings();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <BookingHeader />

      <div className="px-12 py-10">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-50 bg-[#0d0d0d] border border-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 border-t border-[#1a1a1a]">
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-3">
              No Results
            </p>
            <h2
              className="text-white text-3xl font-bold uppercase mb-3"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {searchQuery ? "No Bookings Found" : "No Bookings Yet"}
            </h2>
            <p className="text-[#4b5563] text-sm">
              {searchQuery
                ? "Try adjusting your search terms."
                : "Your booking history will appear here."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-px bg-[#1a1a1a]">
            {filtered.map((booking) => (
              <div key={booking._id || booking.id} className="bg-[#0a0a0a]">
                <BookingCard
                  booking={booking}
                  hotelData={getHotelData(booking)}
                  onReview={setReviewBooking}
                />
              </div>
            ))}
          </div>
        )}

        <BookingSummaryStats bookings={bookings} />
      </div>
    </div>
  );
}
