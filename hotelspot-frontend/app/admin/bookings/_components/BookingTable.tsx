"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { formatDate, BOOKING_STATUS, PAYMENT_STATUS } from "./BookingStats";
import { BookingActions } from "./BookingActions";

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

const STATUS_STYLE: Record<string, { bg: string; dot: string; text: string }> =
  {
    confirmed: {
      bg: "bg-[#0a1f0a]",
      dot: "bg-[#4ade80]",
      text: "text-[#4ade80]",
    },
    pending: {
      bg: "bg-[#1f1a0a]",
      dot: "bg-[#facc15]",
      text: "text-[#facc15]",
    },
    cancelled: {
      bg: "bg-[#1f0a0a]",
      dot: "bg-[#f87171]",
      text: "text-[#f87171]",
    },
    checked_in: {
      bg: "bg-[#130a1f]",
      dot: "bg-[#a78bfa]",
      text: "text-[#a78bfa]",
    },
    checked_out: {
      bg: "bg-[#0a0f1f]",
      dot: "bg-[#60a5fa]",
      text: "text-[#60a5fa]",
    },
    paid: { bg: "bg-[#0a1f0a]", dot: "bg-[#4ade80]", text: "text-[#4ade80]" },
    unpaid: { bg: "bg-[#1f1a0a]", dot: "bg-[#facc15]", text: "text-[#facc15]" },
    refunded: {
      bg: "bg-[#1f0a0a]",
      dot: "bg-[#f87171]",
      text: "text-[#f87171]",
    },
  };

const StatusPill = ({ status }: { status?: string }) => {
  const key = status?.toLowerCase() ?? "";
  const s = STATUS_STYLE[key] ?? {
    bg: "bg-[#111]",
    dot: "bg-[#6b7280]",
    text: "text-[#6b7280]",
  };
  return (
    <span
      className={`${s.bg} ${s.text} text-[9px] font-semibold tracking-[0.14em] uppercase px-2.5 py-1 inline-flex items-center gap-1.5`}
    >
      <span className={`${s.dot} w-1.5 h-1.5 rounded-full shrink-0`} />
      {status?.replace("_", " ") || "N/A"}
    </span>
  );
};

const selCls =
  "bg-[#111] border border-[#2a2a2a] text-[#9ca3af] text-xs px-3.5 py-2.5 outline-none focus:border-[#c9a96e] transition-colors cursor-pointer";

const TH_COLS = [
  "Booking ID",
  "Customer",
  "Hotel",
  "Dates",
  "Amount",
  "Status",
  "Payment",
  "Created",
  "Actions",
];

export function BookingTable({
  bookings,
  isLoading = false,
  onActionComplete,
}: {
  bookings: Booking[];
  isLoading?: boolean;
  onActionComplete?: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    let list = [...bookings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.fullName.toLowerCase().includes(q) ||
          b.hotelName?.toLowerCase().includes(q) ||
          b._id.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q),
      );
    }
    if (statusFilter) list = list.filter((b) => b.status === statusFilter);
    if (paymentFilter)
      list = list.filter((b) => b.paymentStatus === paymentFilter);
    list.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return list;
  }, [bookings, searchQuery, statusFilter, paymentFilter, sortOrder]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="bg-[#0d0d0d] border border-[#1a1a1a] px-6 py-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-60">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3a3a3a]"
          />
          <input
            type="text"
            placeholder="Search name, email, hotel, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${selCls} w-full pl-9 box-border`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selCls}
        >
          <option value="">All Status</option>
          <option value={BOOKING_STATUS.PENDING}>Pending</option>
          <option value={BOOKING_STATUS.CONFIRMED}>Confirmed</option>
          <option value={BOOKING_STATUS.CANCELLED}>Cancelled</option>
          <option value="checked_in">Checked In</option>
          <option value="checked_out">Checked Out</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className={selCls}
        >
          <option value="">All Payments</option>
          <option value={PAYMENT_STATUS.PAID}>Paid</option>
          <option value={PAYMENT_STATUS.UNPAID}>Unpaid</option>
          <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className={selCls}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <p className="text-[#3a3a3a] text-[10px] tracking-[0.18em] uppercase m-0">
        Showing {filtered.length} of {bookings.length} bookings
      </p>

      <div className="bg-[#0d0d0d] border border-[#1a1a1a] overflow-x-auto">
        {isLoading ? (
          <div className="p-12 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[#111] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#2a2a2a] text-[11px] tracking-[0.2em] uppercase">
              No bookings found
            </p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {TH_COLS.map((col) => (
                  <th
                    key={col}
                    className="px-5 py-4 text-left text-[9px] text-[#3a3a3a] tracking-[0.18em] uppercase font-semibold whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, idx) => (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-[#111] hover:bg-[#111] transition-colors"
                >
                  <td className="px-5 py-4">
                    <code className="bg-[#1a1a1a] text-[#c9a96e] text-[10px] px-2 py-1 font-mono">
                      #{booking._id.slice(-8)}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-semibold mb-0.5 m-0">
                      {booking.fullName}
                    </p>
                    <p className="text-[#4b5563] text-xs m-0">
                      {booking.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-[#9ca3af] text-xs">
                    {booking.hotelName || booking.hotelId.slice(-8)}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#9ca3af] text-xs mb-0.5 m-0">
                      {formatDate(booking.checkInDate)}
                    </p>
                    <p className="text-[#3a3a3a] text-[11px] m-0">
                      → {formatDate(booking.checkOutDate)}
                    </p>
                  </td>
                  <td
                    className="px-5 py-4 text-[#c9a96e] text-sm font-bold whitespace-nowrap"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Rs. {booking.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={booking.status} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={booking.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 text-[#4b5563] text-xs whitespace-nowrap">
                    {formatDate(booking.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <BookingActions
                      booking={booking}
                      onActionComplete={onActionComplete}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}
