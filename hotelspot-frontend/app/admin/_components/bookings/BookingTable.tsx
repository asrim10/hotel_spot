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

interface BookingTableProps {
  bookings: Booking[];
  isLoading?: boolean;
  onActionComplete?: () => void;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  confirmed: { bg: "#0a1f0a", color: "#4ade80" },
  pending: { bg: "#1f1a0a", color: "#facc15" },
  cancelled: { bg: "#1f0a0a", color: "#f87171" },
  checked_in: { bg: "#130a1f", color: "#a78bfa" },
  checked_out: { bg: "#0a0f1f", color: "#60a5fa" },
  paid: { bg: "#0a1f0a", color: "#4ade80" },
  unpaid: { bg: "#1f1a0a", color: "#facc15" },
  refunded: { bg: "#1f0a0a", color: "#f87171" },
};

const StatusPill = ({ status }: { status?: string }) => {
  const key = status?.toLowerCase() ?? "";
  const s = STATUS_STYLE[key] ?? { bg: "#111", color: "#6b7280" };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        padding: "0.3rem 0.65rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontFamily: "'Rethink Sans', sans-serif",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.color,
          flexShrink: 0,
        }}
      />
      {status?.replace("_", " ") || "N/A"}
    </span>
  );
};

const sel: React.CSSProperties = {
  background: "#111",
  border: "1px solid #2a2a2a",
  color: "#9ca3af",
  fontSize: 12,
  padding: "0.55rem 0.875rem",
  outline: "none",
  fontFamily: "'Rethink Sans', sans-serif",
  cursor: "pointer",
};

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
}: BookingTableProps) {
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
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {/* Controls bar */}
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#3a3a3a",
            }}
          />
          <input
            type="text"
            placeholder="Search name, email, hotel, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              ...sel,
              width: "100%",
              paddingLeft: 36,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filters */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={sel}
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
          style={sel}
        >
          <option value="">All Payments</option>
          <option value={PAYMENT_STATUS.PAID}>Paid</option>
          <option value={PAYMENT_STATUS.UNPAID}>Unpaid</option>
          <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          style={sel}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Count */}
      <p
        style={{
          color: "#3a3a3a",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: 0,
          fontFamily: "'Rethink Sans', sans-serif",
        }}
      >
        Showing {filtered.length} of {bookings.length} bookings
      </p>

      {/* Table */}
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          overflowX: "auto",
        }}
      >
        {isLoading ? (
          <div
            style={{
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 52,
                  background: "#111",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "5rem", textAlign: "center" }}>
            <p
              style={{
                color: "#2a2a2a",
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Rethink Sans', sans-serif",
              }}
            >
              No bookings found
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {TH_COLS.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "1rem 1.25rem",
                      textAlign: "left",
                      color: "#3a3a3a",
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontFamily: "'Rethink Sans', sans-serif",
                      whiteSpace: "nowrap",
                    }}
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
                  style={{ borderBottom: "1px solid #111" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#111")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* ID */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <code
                      style={{
                        background: "#1a1a1a",
                        color: "#c9a96e",
                        fontSize: 10,
                        padding: "0.25rem 0.5rem",
                        fontFamily: "monospace",
                      }}
                    >
                      #{booking._id.slice(-8)}
                    </code>
                  </td>
                  {/* Customer */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <p
                      style={{
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        margin: "0 0 0.2rem",
                        fontFamily: "'Rethink Sans', sans-serif",
                      }}
                    >
                      {booking.fullName}
                    </p>
                    <p
                      style={{
                        color: "#4b5563",
                        fontSize: 11,
                        margin: 0,
                        fontFamily: "'Rethink Sans', sans-serif",
                      }}
                    >
                      {booking.email}
                    </p>
                  </td>
                  {/* Hotel */}
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      color: "#9ca3af",
                      fontSize: 12,
                      fontFamily: "'Rethink Sans', sans-serif",
                    }}
                  >
                    {booking.hotelName || booking.hotelId.slice(-8)}
                  </td>
                  {/* Dates */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: 12,
                        margin: "0 0 0.2rem",
                        fontFamily: "'Rethink Sans', sans-serif",
                      }}
                    >
                      {formatDate(booking.checkInDate)}
                    </p>
                    <p
                      style={{
                        color: "#3a3a3a",
                        fontSize: 11,
                        margin: 0,
                        fontFamily: "'Rethink Sans', sans-serif",
                      }}
                    >
                      → {formatDate(booking.checkOutDate)}
                    </p>
                  </td>
                  {/* Amount */}
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      color: "#c9a96e",
                      fontSize: 13,
                      fontWeight: 700,
                      fontFamily: "'Georgia', serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Rs. {booking.totalPrice.toLocaleString()}
                  </td>
                  {/* Booking status */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <StatusPill status={booking.status} />
                  </td>
                  {/* Payment */}
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <StatusPill status={booking.paymentStatus} />
                  </td>
                  {/* Created */}
                  <td
                    style={{
                      padding: "1rem 1.25rem",
                      color: "#4b5563",
                      fontSize: 11,
                      fontFamily: "'Rethink Sans', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDate(booking.createdAt)}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "1rem 1.25rem" }}>
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
