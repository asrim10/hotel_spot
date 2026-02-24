import axios from "axios";
import { InitiatePaymentDtoType } from "../dtos/payment.dto";
import { PaymentRepository } from "../repositories/payment.repositories";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY!;
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2";

const paymentRepo = new PaymentRepository();

export class PaymentService {
  async initiatePayment(payload: InitiatePaymentDtoType) {
    const { bookingId, totalPrice, fullName, email } = payload;

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        return_url: `${process.env.CLIENT_URL}/user/booking/verify`,
        website_url: process.env.CLIENT_URL,
        amount: totalPrice * 100, // NPR to paisa
        purchase_order_id: bookingId,
        purchase_order_name: `Hotel Booking - ${bookingId}`,
        customer_info: { name: fullName, email },
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const { pidx, payment_url } = response.data;

    // Save pidx to booking
    await paymentRepo.savePidx(bookingId, pidx);

    return { pidx, payment_url };
  }

  async verifyPayment(pidx: string) {
    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          Authorization: `key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Khalti lookup response:", response.data);

    const { status, transaction_id, purchase_order_id, total_amount } =
      response.data;

    // ← case insensitive check
    if (status?.toLowerCase() === "completed") {
      const booking = await paymentRepo.confirmPayment(pidx, transaction_id);
      return {
        success: true,
        transactionId: transaction_id,
        bookingId: purchase_order_id,
        amount: total_amount / 100,
        booking,
      };
    }

    await paymentRepo.failPayment(pidx);
    return { success: false, status };
  }
}
