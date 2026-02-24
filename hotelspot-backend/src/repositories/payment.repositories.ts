import { BookingModel, IBooking } from "../models/booking.model";

export interface IPaymentRepository {
  savePidx(bookingId: string, pidx: string): Promise<IBooking | null>;
  confirmPayment(pidx: string, transactionId: string): Promise<IBooking | null>;
  failPayment(pidx: string): Promise<IBooking | null>;
  getByPidx(pidx: string): Promise<IBooking | null>;
}

export class PaymentRepository implements IPaymentRepository {
  async savePidx(bookingId: string, pidx: string): Promise<IBooking | null> {
    return BookingModel.findByIdAndUpdate(bookingId, { pidx }, { new: true });
  }

  async confirmPayment(
    pidx: string,
    transactionId: string,
  ): Promise<IBooking | null> {
    return BookingModel.findOneAndUpdate(
      { pidx },
      {
        paymentStatus: "paid",
        paymentMethod: "online",
        status: "confirmed",
        transactionId,
      },
      { new: true },
    );
  }

  async failPayment(pidx: string): Promise<IBooking | null> {
    return BookingModel.findOneAndUpdate(
      { pidx },
      { paymentStatus: "failed" },
      { new: true },
    );
  }

  async getByPidx(pidx: string): Promise<IBooking | null> {
    return BookingModel.findOne({ pidx })
      .populate("userId")
      .populate("hotelId");
  }
}
