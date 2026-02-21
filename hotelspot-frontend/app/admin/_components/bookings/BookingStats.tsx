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
  {
    key: "totalBookings",
    label: "Total",
    Icon: BookOpen,
    color: "text-[#c9a96e]",
    bar: "bg-[#c9a96e]",
  },
  {
    key: "confirmedBookings",
    label: "Confirmed",
    Icon: CheckCircle,
    color: "text-[#4ade80]",
    bar: "bg-[#4ade80]",
  },
  {
    key: "pendingBookings",
    label: "Pending",
    Icon: Clock,
    color: "text-[#facc15]",
    bar: "bg-[#facc15]",
  },
  {
    key: "cancelledBookings",
    label: "Cancelled",
    Icon: XCircle,
    color: "text-[#f87171]",
    bar: "bg-[#f87171]",
  },
  {
    key: "checkedInBookings",
    label: "Checked In",
    Icon: LogIn,
    color: "text-[#a78bfa]",
    bar: "bg-[#a78bfa]",
  },
  {
    key: "checkedOutBookings",
    label: "Checked Out",
    Icon: LogOut,
    color: "text-[#60a5fa]",
    bar: "bg-[#60a5fa]",
  },
] as const;

export function BookingStats({ stats, isLoading }: BookingStatsProps) {
  return (
    <div className="grid grid-cols-6 border-t border-l border-[#1a1a1a]">
      {CARDS.map(({ key, label, Icon, color, bar }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-[#0d0d0d] border-r border-b border-[#1a1a1a] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[#3a3a3a] text-[9px] tracking-[0.2em] uppercase m-0">
              {label}
            </p>
            <Icon size={13} className={`${color} opacity-65`} />
          </div>
          <p
            className="text-white text-[34px] font-bold mb-4 leading-none m-0"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {isLoading ? <span className="text-[#2a2a2a]">—</span> : stats[key]}
          </p>
          <div className={`w-5 h-0.5 ${bar} opacity-50`} />
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
