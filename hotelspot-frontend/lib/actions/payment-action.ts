"use server";

import { initiateKhaltiPayment, verifyKhaltiPayment } from "@/lib/api/payment";

export const handleInitiateKhaltiPayment = async (paymentData: {
  bookingId: string;
  totalPrice: number;
  fullName: string;
  email: string;
}) => {
  try {
    const response = await initiateKhaltiPayment(paymentData);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to initiate Khalti payment",
      };
    }

    return {
      success: true,
      message: "Khalti payment initiated",
      data: {
        payment_url: response.payment_url,
        pidx: response.pidx,
      },
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Initiate Khalti payment action failed",
    };
  }
};

export const handleVerifyKhaltiPayment = async (pidx: string) => {
  try {
    const response = await verifyKhaltiPayment(pidx);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Payment verification failed",
      };
    }

    return {
      success: true,
      message: "Payment verified successfully",
      data: {
        transactionId: response.transactionId,
        bookingId: response.bookingId,
        amount: response.amount,
        booking: response.booking,
      },
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Verify Khalti payment action failed",
    };
  }
};
