import axios from "./axios";
import { API } from "./endpoints";

export const initiateKhaltiPayment = async (paymentData: {
  bookingId: string;
  totalPrice: number;
  fullName: string;
  email: string;
}) => {
  try {
    const response = await axios.post(API.PAYMENT.KHALTI_INITIATE, paymentData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Khalti payment initiation failed",
    );
  }
};

export const verifyKhaltiPayment = async (pidx: string) => {
  try {
    const response = await axios.post(API.PAYMENT.KHALTI_VERIFY, { pidx });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Khalti payment verification failed",
    );
  }
};
