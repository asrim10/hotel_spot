"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DeleteModal from "@/app/_components/DeleteModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Badge } from "@/app/_components/ui/badge";
import {
  Eye,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Trash2,
  CreditCard,
} from "lucide-react";
import {
  formatDate,
  calculateDays,
  getStatusColor,
  BOOKING_STATUS,
  PAYMENT_STATUS,
} from "./booking-utils";
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

interface BookingActionsProps {
  booking: Booking;
  onActionComplete?: () => void;
}

type ActionType =
  | "confirm"
  | "cancel"
  | "checkin"
  | "checkout"
  | "delete"
  | null;

export function BookingActions({
  booking,
  onActionComplete,
}: BookingActionsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(
    booking.paymentStatus || PAYMENT_STATUS.UNPAID,
  );

  const getActionMessage = (action: ActionType | null) => {
    const messages: Record<string, string> = {
      confirm: "Booking confirmed successfully",
      cancel: "Booking cancelled successfully",
      checkin: "Booking checked in successfully",
      checkout: "Booking checked out successfully",
      delete: "Booking deleted successfully",
    };
    return action ? messages[action] : "";
  };

  const handleAction = async () => {
    setIsLoading(true);
    try {
      let response;

      switch (confirmAction) {
        case "confirm":
          response = await handleConfirmBookingAdmin(booking._id);
          break;
        case "cancel":
          response = await handleCancelBookingAdmin(booking._id);
          break;
        case "checkin":
          response = await handleCheckInBookingAdmin(booking._id);
          break;
        case "checkout":
          response = await handleCheckOutBookingAdmin(booking._id);
          break;
        case "delete":
          response = await handleDeleteBookingAdmin(booking._id);
          break;
        default:
          return;
      }

      if (response?.success) {
        toast.success(getActionMessage(confirmAction));
        onActionComplete?.();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
      setConfirmAction(null);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await handleUpdatePaymentStatusAdmin(
        booking._id,
        paymentStatus,
      );
      if (response?.success) {
        toast.success("Payment status updated successfully");
        setShowPaymentDialog(false);
        onActionComplete?.();
      } else {
        toast.error(response?.message || "Failed to update payment status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const canConfirm = booking.status === BOOKING_STATUS.PENDING;
  const canCancel = [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(
    booking.status as any,
  );
  const canCheckIn = booking.status === BOOKING_STATUS.CONFIRMED;
  const canCheckOut = booking.status === "checked_in";

  return (
    <>
      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(true)}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </motion.button>

        {canConfirm && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmAction("confirm")}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            title="Confirm Booking"
          >
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </motion.button>
        )}

        {canCancel && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmAction("cancel")}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            title="Cancel Booking"
          >
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </motion.button>
        )}

        {canCheckIn && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmAction("checkin")}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            title="Check In"
          >
            <LogIn className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </motion.button>
        )}

        {canCheckOut && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmAction("checkout")}
            className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            title="Check Out"
          >
            <LogOut className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPaymentDialog(true)}
          className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
          title="Update Payment"
        >
          <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setConfirmAction("delete")}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          title="Delete Booking"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </motion.button>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Booking ID: {booking._id}</DialogDescription>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-4"
          >
            {/* User Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Customer Name
                </label>
                <p className="text-lg font-medium mt-1">{booking.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-lg font-medium mt-1">{booking.email}</p>
              </div>
            </div>

            {/* Hotel Information */}
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Hotel
              </label>
              <p className="text-lg font-medium mt-1">
                {booking.hotelName || "N/A"}
              </p>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Check In
                </label>
                <p className="text-lg font-medium mt-1">
                  {formatDate(booking.checkInDate)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Check Out
                </label>
                <p className="text-lg font-medium mt-1">
                  {formatDate(booking.checkOutDate)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Total Days
                </label>
                <p className="text-lg font-medium mt-1">
                  {calculateDays(booking.checkInDate, booking.checkOutDate)}{" "}
                  nights
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Total Price
                </label>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Rs. {booking.totalPrice}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Booking Status
                </label>
                <div className="mt-2">
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Payment Status
                </label>
                <div className="mt-2">
                  <Badge variant={getStatusColor(booking.paymentStatus || "")}>
                    {booking.paymentStatus?.toUpperCase() || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Created Date
              </label>
              <p className="text-lg font-medium mt-1">
                {formatDate(booking.createdAt)}
              </p>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Payment Status Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 transition-colors cursor-pointer"
              >
                <option value="">Select Payment Status</option>
                <option value={PAYMENT_STATUS.UNPAID}>Unpaid</option>
                <option value={PAYMENT_STATUS.PAID}>Paid</option>
                <option value={PAYMENT_STATUS.REFUNDED}>Refunded</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentStatusUpdate}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <DeleteModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleAction}
        title={
          confirmAction === "delete"
            ? "Delete Booking"
            : confirmAction === "confirm"
              ? "Confirm Booking"
              : confirmAction === "cancel"
                ? "Cancel Booking"
                : confirmAction === "checkin"
                  ? "Check In Booking"
                  : "Check Out Booking"
        }
        description={
          confirmAction === "confirm"
            ? "Are you sure you want to confirm this booking?"
            : confirmAction === "cancel"
              ? "Are you sure you want to cancel this booking?"
              : confirmAction === "checkin"
                ? "Are you sure you want to check in this booking?"
                : confirmAction === "checkout"
                  ? "Are you sure you want to check out this booking?"
                  : "This action cannot be undone. Are you sure you want to delete this booking?"
        }
      />
    </>
  );
}
