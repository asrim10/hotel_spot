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
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "'Rethink Sans', sans-serif",
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          borderBottom: "1px solid #1a1a1a",
          padding: "3rem 3rem 2.5rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                color: "#c9a96e",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Admin Panel
            </p>
            <h1
              style={{
                color: "#fff",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                textTransform: "uppercase",
                margin: 0,
                lineHeight: 1.05,
                fontFamily: "'Georgia', serif",
              }}
            >
              Bookings
            </h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "1px solid #2a2a2a",
              color: "#6b7280",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "0.75rem 1.5rem",
              cursor: isRefreshing ? "not-allowed" : "pointer",
              fontFamily: "'Rethink Sans', sans-serif",
              opacity: isRefreshing ? 0.5 : 1,
            }}
          >
            <RefreshCw
              size={13}
              style={{
                animation: isRefreshing ? "spin 1s linear infinite" : "none",
              }}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </motion.button>
        </motion.div>
      </div>

      {/* ── Stats ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ padding: "2.5rem 3rem 0" }}>
          <p
            style={{
              color: "#3a3a3a",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: "0 0 1rem",
            }}
          >
            Overview
          </p>
        </div>
        <div style={{ padding: "0 3rem 2.5rem" }}>
          <BookingStats stats={stats} isLoading={isLoading} />
        </div>
      </motion.div>

      {/* ── Divider ── */}
      <div style={{ borderTop: "1px solid #1a1a1a", margin: "0 3rem" }} />

      {/* ── Table ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ padding: "2.5rem 3rem 4rem" }}
      >
        <p
          style={{
            color: "#3a3a3a",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            margin: "0 0 1.5rem",
          }}
        >
          All Bookings
        </p>
        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          onActionComplete={() => fetchData(false)}
        />
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
