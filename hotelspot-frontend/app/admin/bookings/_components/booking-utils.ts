// Booking Status Constants
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

// Status Color Mapping
export const getStatusColor = (
  status: string,
): "default" | "success" | "warning" | "destructive" => {
  switch (status?.toLowerCase()) {
    case BOOKING_STATUS.CONFIRMED:
    case PAYMENT_STATUS.PAID:
      return "success";
    case BOOKING_STATUS.PENDING:
    case PAYMENT_STATUS.UNPAID:
      return "warning";
    case BOOKING_STATUS.CANCELLED:
    case PAYMENT_STATUS.REFUNDED:
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
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};
