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
  paymentMethod?: string;
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
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/80" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-[#0d0d0d] border border-[#1a1a1a] w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#1a1a1a]">
          <div>
            <p className="text-[#c9a96e] text-[9px] tracking-[0.2em] uppercase mb-1">
              Admin
            </p>
            <h2
              className="text-white text-lg font-bold uppercase m-0"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </motion.div>
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  iconColor,
  hoverBorderColor,
  children,
}: {
  onClick: () => void;
  title: string;
  iconColor: string;
  hoverBorderColor: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className={`border border-[#1a1a1a] p-1.5 flex items-center justify-center cursor-pointer bg-transparent transition-colors ${hoverBorderColor}`}
      style={{ color: iconColor }}
    >
      {children}
    </motion.button>
  );
}

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

  const actionTitle =
    confirmAction === "delete"
      ? "Delete Booking"
      : confirmAction === "confirm"
        ? "Confirm Booking"
        : confirmAction === "cancel"
          ? "Cancel Booking"
          : confirmAction === "checkin"
            ? "Check In"
            : "Check Out";

  const infoLabelCls =
    "block text-[#c9a96e] text-[9px] tracking-[0.18em] uppercase mb-1.5";
  const infoValueCls = "text-white text-sm font-semibold m-0";
  const infoSubCls = "text-[#6b7280] text-xs m-0";
  const cancelBtnCls =
    "border border-[#2a2a2a] bg-[#111] text-[#9ca3af] text-[11px] tracking-[0.1em] uppercase px-5 py-2.5 cursor-pointer hover:border-[#3a3a3a] transition-colors bg-transparent";
  const selCls =
    "w-full bg-[#111] border border-[#2a2a2a] text-white text-sm px-4 py-3 outline-none focus:border-[#c9a96e] transition-colors cursor-pointer mt-2";

  return (
    <>
      <div className="flex gap-1.5 flex-wrap">
        <IconBtn
          onClick={() => setShowDetails(true)}
          title="View"
          iconColor="#60a5fa"
          hoverBorderColor="hover:border-[#60a5fa]"
        >
          <Eye size={13} />
        </IconBtn>
        {canConfirm && (
          <IconBtn
            onClick={() => setConfirmAction("confirm")}
            title="Confirm"
            iconColor="#4ade80"
            hoverBorderColor="hover:border-[#4ade80]"
          >
            <CheckCircle size={13} />
          </IconBtn>
        )}
        {canCancel && (
          <IconBtn
            onClick={() => setConfirmAction("cancel")}
            title="Cancel"
            iconColor="#f87171"
            hoverBorderColor="hover:border-[#f87171]"
          >
            <XCircle size={13} />
          </IconBtn>
        )}
        {canCheckIn && (
          <IconBtn
            onClick={() => setConfirmAction("checkin")}
            title="Check In"
            iconColor="#a78bfa"
            hoverBorderColor="hover:border-[#a78bfa]"
          >
            <LogIn size={13} />
          </IconBtn>
        )}
        {canCheckOut && (
          <IconBtn
            onClick={() => setConfirmAction("checkout")}
            title="Check Out"
            iconColor="#60a5fa"
            hoverBorderColor="hover:border-[#60a5fa]"
          >
            <LogOut size={13} />
          </IconBtn>
        )}
        <IconBtn
          onClick={() => setShowPayment(true)}
          title="Payment"
          iconColor="#c9a96e"
          hoverBorderColor="hover:border-[#c9a96e]"
        >
          <CreditCard size={13} />
        </IconBtn>
        <IconBtn
          onClick={() => setConfirmAction("delete")}
          title="Delete"
          iconColor="#f87171"
          hoverBorderColor="hover:border-[#f87171]"
        >
          <Trash2 size={13} />
        </IconBtn>
      </div>

      <AnimatePresence>
        {showDetails && (
          <DarkModal
            open={showDetails}
            onClose={() => setShowDetails(false)}
            title="Booking Details"
          >
            <div className="flex flex-col gap-6">
              <div>
                <span className={infoLabelCls}>Booking ID</span>
                <code className="text-[#c9a96e] text-sm font-mono">
                  #{booking._id}
                </code>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className={infoLabelCls}>Customer</span>
                  <p className={infoValueCls}>{booking.fullName}</p>
                </div>
                <div>
                  <span className={infoLabelCls}>Email</span>
                  <p className={infoSubCls}>{booking.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className={infoLabelCls}>Hotel</span>
                  {booking.hotelName ? (
                    <p className={infoValueCls}>{booking.hotelName}</p>
                  ) : (
                    <div>
                      <p className="text-[#6b7280] text-xs m-0 mb-0.5">
                        ID (name not joined)
                      </p>
                      <code className="text-[#3a3a3a] text-[10px] font-mono">
                        {booking.hotelId}
                      </code>
                    </div>
                  )}
                </div>
                <div>
                  <span className={infoLabelCls}>Payment Method</span>
                  <p
                    className={infoValueCls}
                    style={{ textTransform: "capitalize" }}
                  >
                    {booking.paymentMethod || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className={infoLabelCls}>Check In</span>
                  <p className={infoValueCls}>
                    {formatDate(booking.checkInDate)}
                  </p>
                </div>
                <div>
                  <span className={infoLabelCls}>Check Out</span>
                  <p className={infoValueCls}>
                    {formatDate(booking.checkOutDate)}
                  </p>
                </div>
                <div>
                  <span className={infoLabelCls}>Nights</span>
                  <p className={infoValueCls}>
                    {calculateDays(booking.checkInDate, booking.checkOutDate)}
                  </p>
                </div>
              </div>
              <div className="bg-[#111] border border-[#1a1a1a] px-6 py-5 flex items-center justify-between">
                <span className={infoLabelCls}>Total Price</span>
                <span
                  className="text-[#c9a96e] text-2xl font-bold"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Rs. {booking.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className={infoLabelCls}>Booking Status</span>
                  <span className="text-white text-xs uppercase tracking-widest">
                    {booking.status?.replace("_", " ")}
                  </span>
                </div>
                <div>
                  <span className={infoLabelCls}>Payment Status</span>
                  <span className="text-white text-xs uppercase tracking-widest">
                    {booking.paymentStatus || "N/A"}
                  </span>
                </div>
              </div>
              <div>
                <span className={infoLabelCls}>Created</span>
                <p className={infoSubCls}>{formatDate(booking.createdAt)}</p>
              </div>
            </div>
          </DarkModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPayment && (
          <DarkModal
            open={showPayment}
            onClose={() => setShowPayment(false)}
            title="Update Payment"
          >
            <div className="flex flex-col gap-6">
              <div>
                <span className={infoLabelCls}>Payment Status</span>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className={selCls}
                >
                  <option value="">Select status</option>
                  <option value={PAYMENT_STATUS.UNPAID}>Unpaid</option>
                  <option value={PAYMENT_STATUS.PAID}>Paid</option>
                  <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className={cancelBtnCls}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentUpdate}
                  disabled={isLoading}
                  className="bg-[#c9a96e] border border-[#c9a96e] text-[#0a0a0a] text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </DarkModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmAction && (
          <DarkModal
            open={!!confirmAction}
            onClose={() => setConfirmAction(null)}
            title={actionTitle}
          >
            <div className="flex flex-col gap-6">
              <p className="text-[#9ca3af] text-sm leading-relaxed m-0">
                {confirmAction === "delete"
                  ? "This action cannot be undone. The booking will be permanently deleted."
                  : `Are you sure you want to ${confirmAction === "confirm" ? "confirm" : confirmAction === "cancel" ? "cancel" : confirmAction === "checkin" ? "check in" : "check out"} this booking?`}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className={cancelBtnCls}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={isLoading}
                  className={`text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 cursor-pointer transition-opacity disabled:opacity-50 border ${
                    confirmAction === "delete"
                      ? "bg-[#7f1d1d] border-[#7f1d1d] text-white hover:bg-red-900"
                      : "bg-[#c9a96e] border-[#c9a96e] text-[#0a0a0a] hover:opacity-90"
                  }`}
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
