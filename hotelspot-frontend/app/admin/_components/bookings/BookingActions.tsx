"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Eye,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Trash2,
  CreditCard,
  X,
} from "lucide-react";
import {
  formatDate,
  calculateDays,
  BOOKING_STATUS,
  PAYMENT_STATUS,
} from "./BookingStats";
import {
  handleConfirmBookingAdmin,
  handleCancelBookingAdmin,
  handleCheckInBookingAdmin,
  handleCheckOutBookingAdmin,
  handleDeleteBookingAdmin,
  handleUpdatePaymentStatusAdmin,
} from "@/lib/actions/admin/booking-action";

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

type ActionType =
  | "confirm"
  | "cancel"
  | "checkin"
  | "checkout"
  | "delete"
  | null;

const ACTION_MESSAGES: Record<string, string> = {
  confirm: "Booking confirmed successfully",
  cancel: "Booking cancelled successfully",
  checkin: "Checked in successfully",
  checkout: "Checked out successfully",
  delete: "Booking deleted",
};

// Dark modal wrapper

function DarkModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        style={{
          position: "relative",
          background: "#0d0d0d",
          border: "1px solid #1a1a1a",
          width: "90%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          fontFamily: "'Rethink Sans', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <div>
            <p
              style={{
                color: "#c9a96e",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 0.3rem",
              }}
            >
              Admin
            </p>
            <h2
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                fontFamily: "'Georgia', serif",
                textTransform: "uppercase",
              }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: "2rem" }}>{children}</div>
      </motion.div>
    </div>
  );
}

// ── Icon button ─────────────────────────────────────────────────────────────

function IconBtn({
  onClick,
  title,
  color,
  children,
}: {
  onClick: () => void;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      style={{
        background: "none",
        border: "1px solid #1a1a1a",
        color,
        padding: "0.4rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
    >
      {children}
    </motion.button>
  );
}

const infoLabel: React.CSSProperties = {
  color: "#c9a96e",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  margin: "0 0 0.4rem",
  display: "block",
};
const infoValue: React.CSSProperties = {
  color: "#fff",
  fontSize: 14,
  fontWeight: 600,
  margin: 0,
};
const infoSub: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 12,
  margin: 0,
};

export function BookingActions({
  booking,
  onActionComplete,
}: {
  booking: Booking;
  onActionComplete?: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(
    booking.paymentStatus || PAYMENT_STATUS.UNPAID,
  );

  const canConfirm = booking.status === BOOKING_STATUS.PENDING;
  const canCancel = [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(
    booking.status as any,
  );
  const canCheckIn = booking.status === BOOKING_STATUS.CONFIRMED;
  const canCheckOut = booking.status === "checked_in";

  const handleAction = async () => {
    setIsLoading(true);
    try {
      const map: Record<string, () => Promise<any>> = {
        confirm: () => handleConfirmBookingAdmin(booking._id),
        cancel: () => handleCancelBookingAdmin(booking._id),
        checkin: () => handleCheckInBookingAdmin(booking._id),
        checkout: () => handleCheckOutBookingAdmin(booking._id),
        delete: () => handleDeleteBookingAdmin(booking._id),
      };
      const res = await map[confirmAction!]?.();
      if (res?.success) {
        toast.success(ACTION_MESSAGES[confirmAction!]);
        onActionComplete?.();
      } else toast.error(res?.message || "Something went wrong");
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handlePaymentUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await handleUpdatePaymentStatusAdmin(
        booking._id,
        paymentStatus,
      );
      if (res?.success) {
        toast.success("Payment status updated");
        setShowPayment(false);
        onActionComplete?.();
      } else toast.error(res?.message || "Failed to update");
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const btnStyle: React.CSSProperties = {
    background: "#111",
    border: "1px solid #2a2a2a",
    color: "#9ca3af",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "0.6rem 1.25rem",
    cursor: "pointer",
    fontFamily: "'Rethink Sans', sans-serif",
  };
  const selStyle: React.CSSProperties = {
    width: "100%",
    background: "#111",
    border: "1px solid #2a2a2a",
    color: "#fff",
    fontSize: 13,
    padding: "0.75rem 1rem",
    outline: "none",
    fontFamily: "'Rethink Sans', sans-serif",
    cursor: "pointer",
    marginTop: "0.5rem",
  };

  return (
    <>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <IconBtn
          onClick={() => setShowDetails(true)}
          title="View"
          color="#60a5fa"
        >
          <Eye size={13} />
        </IconBtn>
        {canConfirm && (
          <IconBtn
            onClick={() => setConfirmAction("confirm")}
            title="Confirm"
            color="#4ade80"
          >
            <CheckCircle size={13} />
          </IconBtn>
        )}
        {canCancel && (
          <IconBtn
            onClick={() => setConfirmAction("cancel")}
            title="Cancel"
            color="#f87171"
          >
            <XCircle size={13} />
          </IconBtn>
        )}
        {canCheckIn && (
          <IconBtn
            onClick={() => setConfirmAction("checkin")}
            title="Check In"
            color="#a78bfa"
          >
            <LogIn size={13} />
          </IconBtn>
        )}
        {canCheckOut && (
          <IconBtn
            onClick={() => setConfirmAction("checkout")}
            title="Check Out"
            color="#60a5fa"
          >
            <LogOut size={13} />
          </IconBtn>
        )}
        <IconBtn
          onClick={() => setShowPayment(true)}
          title="Payment"
          color="#c9a96e"
        >
          <CreditCard size={13} />
        </IconBtn>
        <IconBtn
          onClick={() => setConfirmAction("delete")}
          title="Delete"
          color="#f87171"
        >
          <Trash2 size={13} />
        </IconBtn>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {showDetails && (
          <DarkModal
            open={showDetails}
            onClose={() => setShowDetails(false)}
            title="Booking Details"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* ID */}
              <div>
                <span style={infoLabel}>Booking ID</span>
                <code
                  style={{
                    ...infoValue,
                    color: "#c9a96e",
                    fontFamily: "monospace",
                    fontSize: 13,
                  }}
                >
                  #{booking._id}
                </code>
              </div>
              {/* Customer */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <span style={infoLabel}>Customer</span>
                  <p style={infoValue}>{booking.fullName}</p>
                </div>
                <div>
                  <span style={infoLabel}>Email</span>
                  <p style={infoSub}>{booking.email}</p>
                </div>
              </div>
              {/* Hotel */}
              <div>
                <span style={infoLabel}>Hotel</span>
                <p style={infoValue}>{booking.hotelName || "N/A"}</p>
              </div>
              {/* Dates */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <span style={infoLabel}>Check In</span>
                  <p style={infoValue}>{formatDate(booking.checkInDate)}</p>
                </div>
                <div>
                  <span style={infoLabel}>Check Out</span>
                  <p style={infoValue}>{formatDate(booking.checkOutDate)}</p>
                </div>
                <div>
                  <span style={infoLabel}>Nights</span>
                  <p style={infoValue}>
                    {calculateDays(booking.checkInDate, booking.checkOutDate)}
                  </p>
                </div>
              </div>
              {/* Price */}
              <div
                style={{
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={infoLabel}>Total Price</span>
                <span
                  style={{
                    color: "#c9a96e",
                    fontSize: 24,
                    fontWeight: 700,
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  Rs. {booking.totalPrice.toLocaleString()}
                </span>
              </div>
              {/* Status */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <span style={infoLabel}>Booking Status</span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {booking.status?.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span style={infoLabel}>Payment Status</span>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {booking.paymentStatus || "N/A"}
                  </span>
                </div>
              </div>
              {/* Created */}
              <div>
                <span style={infoLabel}>Created</span>
                <p style={infoSub}>{formatDate(booking.createdAt)}</p>
              </div>
            </div>
          </DarkModal>
        )}
      </AnimatePresence>

      {/* Payment modal */}
      <AnimatePresence>
        {showPayment && (
          <DarkModal
            open={showPayment}
            onClose={() => setShowPayment(false)}
            title="Update Payment"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <span style={infoLabel}>Payment Status</span>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  style={selStyle}
                >
                  <option value="">Select status</option>
                  <option value={PAYMENT_STATUS.UNPAID}>Unpaid</option>
                  <option value={PAYMENT_STATUS.PAID}>Paid</option>
                  <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button onClick={() => setShowPayment(false)} style={btnStyle}>
                  Cancel
                </button>
                <button
                  onClick={handlePaymentUpdate}
                  disabled={isLoading}
                  style={{
                    ...btnStyle,
                    background: "#c9a96e",
                    color: "#0a0a0a",
                    fontWeight: 700,
                    borderColor: "#c9a96e",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </DarkModal>
        )}
      </AnimatePresence>

      {/* Confirm action modal */}
      <AnimatePresence>
        {confirmAction && (
          <DarkModal
            open={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            title={
              confirmAction === "delete"
                ? "Delete Booking"
                : confirmAction === "confirm"
                  ? "Confirm Booking"
                  : confirmAction === "cancel"
                    ? "Cancel Booking"
                    : confirmAction === "checkin"
                      ? "Check In"
                      : "Check Out"
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: 14,
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                {confirmAction === "delete"
                  ? "This action cannot be undone. The booking will be permanently deleted."
                  : `Are you sure you want to ${confirmAction === "confirm" ? "confirm" : confirmAction === "cancel" ? "cancel" : confirmAction === "checkin" ? "check in" : "check out"} this booking?`}
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                }}
              >
                <button onClick={() => setConfirmAction(null)} style={btnStyle}>
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isLoading}
                  style={{
                    ...btnStyle,
                    background:
                      confirmAction === "delete" ? "#7f1d1d" : "#c9a96e",
                    color: confirmAction === "delete" ? "#fff" : "#0a0a0a",
                    fontWeight: 700,
                    borderColor:
                      confirmAction === "delete" ? "#7f1d1d" : "#c9a96e",
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </DarkModal>
        )}
      </AnimatePresence>
    </>
  );
}
