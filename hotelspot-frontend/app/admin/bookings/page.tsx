"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { BookingStats } from "@/app/admin/_components/bookings/BookingStats";
import { BookingTable } from "@/app/admin/_components/bookings/BookingTable";
import {
  handleGetAllBookingsAdmin,
  handleGetBookingStatsAdmin,
} from "@/lib/actions/admin/booking-action";

interface BookingStatsData {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  checkedInBookings: number;
  checkedOutBookings: number;
}

interface Booking {
  _id: string;
  hotelId: string;
  hotelName?: string;
  fullName: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

const EMPTY_STATS: BookingStatsData = {
  totalBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  pendingBookings: 0,
  checkedInBookings: 0,
  checkedOutBookings: 0,
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStatsData>(EMPTY_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showMsg = false) => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        handleGetAllBookingsAdmin(),
        handleGetBookingStatsAdmin(),
      ]);
      if (bookingsRes?.success)
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      else toast.error(bookingsRes?.message || "Failed to fetch bookings");
      if (statsRes?.success) setStats(statsRes.data || EMPTY_STATS);
      if (showMsg) toast.success("Bookings refreshed");
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-[#1a1a1a] px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.22em] uppercase mb-3">
              Admin Panel
            </p>
            <h1
              className="text-white font-bold uppercase leading-tight m-0 text-5xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Bookings
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 bg-transparent border border-[#2a2a2a] text-[#6b7280] text-[11px] tracking-[0.14em] uppercase px-6 py-3 transition-colors hover:border-[#3a3a3a] hover:text-[#9ca3af] ${isRefreshing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <RefreshCw
              size={13}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="px-12 pt-10">
          <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase mb-4">
            Overview
          </p>
        </div>
        <div className="px-12 pb-10">
          <BookingStats stats={stats} isLoading={isLoading} />
        </div>
      </motion.div>

      <div className="border-t border-[#1a1a1a] mx-12" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-12 py-10 pb-16"
      >
        <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase mb-6">
          All Bookings
        </p>
        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          onActionComplete={() => fetchData(false)}
        />
      </motion.div>
    </div>
  );
}
