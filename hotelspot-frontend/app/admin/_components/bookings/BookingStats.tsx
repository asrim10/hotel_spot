"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react";

interface BookingStatsProps {
  stats: {
    totalBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    checkedInBookings: number;
    checkedOutBookings: number;
  };
  isLoading?: boolean;
}

const CARDS = [
  { key: "totalBookings", label: "Total", Icon: BookOpen, accent: "#c9a96e" },
  {
    key: "confirmedBookings",
    label: "Confirmed",
    Icon: CheckCircle,
    accent: "#4ade80",
  },
  { key: "pendingBookings", label: "Pending", Icon: Clock, accent: "#facc15" },
  {
    key: "cancelledBookings",
    label: "Cancelled",
    Icon: XCircle,
    accent: "#f87171",
  },
  {
    key: "checkedInBookings",
    label: "Checked In",
    Icon: LogIn,
    accent: "#a78bfa",
  },
  {
    key: "checkedOutBookings",
    label: "Checked Out",
    Icon: LogOut,
    accent: "#60a5fa",
  },
] as const;

export function BookingStats({ stats, isLoading }: BookingStatsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        borderTop: "1px solid #1a1a1a",
        borderLeft: "1px solid #1a1a1a",
      }}
    >
      {CARDS.map(({ key, label, Icon, accent }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          style={{
            background: "#0d0d0d",
            borderRight: "1px solid #1a1a1a",
            borderBottom: "1px solid #1a1a1a",
            padding: "1.75rem 1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <p
              style={{
                color: "#3a3a3a",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: 0,
                fontFamily: "'Rethink Sans', sans-serif",
              }}
            >
              {label}
            </p>
            <Icon size={13} style={{ color: accent, opacity: 0.65 }} />
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: 34,
              fontWeight: 700,
              margin: "0 0 1rem",
              fontFamily: "'Georgia', serif",
              lineHeight: 1,
            }}
          >
            {isLoading ? (
              <span style={{ color: "#2a2a2a" }}>—</span>
            ) : (
              stats[key]
            )}
          </p>
          <div
            style={{ width: 20, height: 2, background: accent, opacity: 0.5 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
} as const;
export const PAYMENT_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
  REFUNDED: "refunded",
} as const;

export const getStatusColor = (
  status: string,
): "default" | "success" | "warning" | "destructive" => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "paid":
      return "success";
    case "pending":
    case "unpaid":
      return "warning";
    case "cancelled":
    case "refunded":
      return "destructive";
    default:
      return "default";
  }
};

export const formatDate = (date: string | Date) => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export const calculateDays = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  try {
    return Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000,
    );
  } catch {
    return 0;
  }
};
