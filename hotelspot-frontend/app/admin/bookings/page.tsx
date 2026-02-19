"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { BookingStats } from "@/app/admin/_components/bookings/BookingStats";
import { BookingTable } from "@/app/admin/_components/bookings/BookingTable";
import {
  handleGetAllBookingsAdmin,
  handleGetBookingStatsAdmin,
} from "@/lib/actions/admin/booking-action";

interface BookingStats {
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    checkedInBookings: 0,
    checkedOutBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showRefreshMessage = false) => {
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        handleGetAllBookingsAdmin(),
        handleGetBookingStatsAdmin(),
      ]);

      if (bookingsRes?.success) {
        setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
      } else {
        toast.error(bookingsRes?.message || "Failed to fetch bookings");
      }

      if (statsRes?.success) {
        setStats(statsRes.data || stats);
      }

      if (showRefreshMessage) {
        toast.success("Bookings refreshed successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch data");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header with Gradient Background */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 text-white px-6 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Bookings Management</h1>
                <p className="text-blue-100 mt-1">
                  Track, manage, and update hotel bookings
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <BookingStats stats={stats} isLoading={isLoading} />
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            All Bookings
          </h2>
          <BookingTable
            bookings={bookings}
            isLoading={isLoading}
            onActionComplete={() => fetchData(false)}
          />
        </motion.div>
      </div>
    </div>
  );
}
