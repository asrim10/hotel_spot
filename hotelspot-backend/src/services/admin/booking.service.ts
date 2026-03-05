import { bookingStatusEmail } from "../../config/bookingStatusEmail";
import { sendEmail } from "../../config/email";
import { CreateBookingDTO, UpdateBookingDTO } from "../../dtos/booking.dto";
import { HttpError } from "../../errors/http-error";
import { BookingRepository } from "../../repositories/booking.repositories";
import { AdminNotificationService } from "./notification.service";

let bookingRepository = new BookingRepository();
const adminNotificationService = new AdminNotificationService();

const NOTIFICATION_MAP: Record<
  string,
  { title: string; type: string; message: (booking: any) => string }
> = {
  confirmed: {
    title: "Booking Confirmed ✅",
    type: "booking_confirmed",
    message: (b) =>
      `Your booking has been confirmed. Check-in: ${new Date(b.checkInDate).toDateString()}`,
  },
  cancelled: {
    title: "Booking Cancelled ❌",
    type: "booking_cancelled",
    message: (b) =>
      `Your booking has been cancelled. Check-in was: ${new Date(b.checkInDate).toDateString()}`,
  },
  checked_in: {
    title: "Checked In 🏨",
    type: "checked_in",
    message: (b) =>
      `You have been checked in. Enjoy your stay! Check-out: ${new Date(b.checkOutDate).toDateString()}`,
  },
  checked_out: {
    title: "Checked Out 👋",
    type: "checked_out",
    message: () => `You have been checked out. Thank you for staying with us!`,
  },
  pending: {
    title: "Booking Pending ⏳",
    type: "booking_pending",
    message: (b) =>
      `Your booking is pending review. Check-in: ${new Date(b.checkInDate).toDateString()}`,
  },
};

export class AdminBookingService {
  // helper to extract userId from populated or plain field
  private extractUserId(booking: any): string {
    const userId = booking.userId;
    return typeof userId === "object" ? userId?._id?.toString() : userId;
  }

  // helper to send email + create notification
  private async notifyUser(
    booking: any,
    status: string,
    bookingId: string,
  ): Promise<void> {
    const notif = NOTIFICATION_MAP[status];
    if (!notif) return;

    const userId = this.extractUserId(booking);

    // send email
    try {
      const { subject, html } = bookingStatusEmail(
        booking.fullName,
        status,
        booking,
      );
      await sendEmail(booking.email, subject, html);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // create notification
    try {
      await adminNotificationService.createNotification({
        userId,
        title: notif.title,
        type: notif.type as any,
        message: notif.message(booking),
        bookingId,
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }
  }

  async getAllBookings(page: number = 1, size: number = 10, search?: string) {
    if (page < 1) {
      throw new HttpError(400, "Page number must be greater than 0");
    }

    if (size < 1 || size > 100) {
      throw new HttpError(400, "Size must be between 1 and 100");
    }

    const { bookings, total } = await bookingRepository.getAllPaginated(
      page,
      size,
      search,
    );

    return {
      bookings,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async getBookingById(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    return booking;
  }

  async getBookingsByUserId(userId: string) {
    const bookings = await bookingRepository.getByUserId(userId);
    return bookings;
  }

  async createBooking(data: CreateBookingDTO & { userId: string }) {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    if (checkOut <= checkIn) {
      throw new HttpError(400, "Check-out date must be after check-in date");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      throw new HttpError(400, "Check-in date cannot be in the past");
    }

    const newBooking = await bookingRepository.create(data);
    return newBooking;
  }

  async updateBookingStatus(
    id: string,
    status:
      | "pending"
      | "confirmed"
      | "cancelled"
      | "checked_in"
      | "checked_out",
  ) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    this.validateStatusTransition(booking.status, status);

    const updatedBooking = await bookingRepository.update(id, { status });

    await this.notifyUser(booking, status, id);

    return updatedBooking;
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: "pending" | "paid" | "failed",
  ) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const updatedBooking = await bookingRepository.update(id, {
      paymentStatus,
    });
    return updatedBooking;
  }

  async updateBooking(id: string, updateData: UpdateBookingDTO) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new HttpError(400, "Cannot update a cancelled booking");
    }

    const updatedBooking = await bookingRepository.update(id, updateData);
    return updatedBooking;
  }

  async cancelBooking(id: string, reason?: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status === "cancelled") {
      throw new HttpError(400, "Booking is already cancelled");
    }

    if (booking.status === "checked_out") {
      throw new HttpError(400, "Cannot cancel a completed booking");
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "cancelled",
    });

    await this.notifyUser(booking, "cancelled", id);

    return updatedBooking;
  }

  async confirmBooking(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status !== "pending") {
      throw new HttpError(
        400,
        `Cannot confirm booking with status: ${booking.status}`,
      );
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "confirmed",
    });

    await this.notifyUser(booking, "confirmed", id);

    return updatedBooking;
  }

  async checkIn(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status !== "confirmed") {
      throw new HttpError(
        400,
        `Cannot check-in booking with status: ${booking.status}`,
      );
    }

    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      throw new HttpError(400, "Cannot check-in before check-in date");
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "checked_in",
    });

    await this.notifyUser(booking, "checked_in", id);

    return updatedBooking;
  }

  async checkOut(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status !== "checked_in") {
      throw new HttpError(
        400,
        `Cannot check-out booking with status: ${booking.status}`,
      );
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "checked_out",
    });

    await this.notifyUser(booking, "checked_out", id);

    return updatedBooking;
  }

  async deleteBooking(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (booking.status !== "cancelled" && booking.status !== "checked_out") {
      throw new HttpError(
        400,
        "Can only delete cancelled or completed bookings",
      );
    }

    const deleted = await bookingRepository.delete(id);
    return deleted;
  }

  async getBookingStats() {
    const allBookings = await bookingRepository.getAll();

    const stats = {
      totalBookings: allBookings.length,
      pendingBookings: allBookings.filter((b) => b.status === "pending").length,
      confirmedBookings: allBookings.filter((b) => b.status === "confirmed")
        .length,
      checkedInBookings: allBookings.filter((b) => b.status === "checked_in")
        .length,
      checkedOutBookings: allBookings.filter((b) => b.status === "checked_out")
        .length,
      cancelledBookings: allBookings.filter((b) => b.status === "cancelled")
        .length,
      paymentPendingBookings: allBookings.filter(
        (b) => b.paymentStatus === "pending",
      ).length,
      paymentPaidBookings: allBookings.filter((b) => b.paymentStatus === "paid")
        .length,
      paymentFailedBookings: allBookings.filter(
        (b) => b.paymentStatus === "failed",
      ).length,
      totalRevenue: allBookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + b.totalPrice, 0),
      todayCheckIns: allBookings.filter((b) => {
        const checkInDate = new Date(b.checkInDate);
        const today = new Date();
        return (
          checkInDate.toDateString() === today.toDateString() &&
          b.status === "confirmed"
        );
      }).length,
      todayCheckOuts: allBookings.filter((b) => {
        const checkOutDate = new Date(b.checkOutDate);
        const today = new Date();
        return (
          checkOutDate.toDateString() === today.toDateString() &&
          b.status === "checked_in"
        );
      }).length,
    };

    return stats;
  }

  async getBookingsByDateRange(startDate: string, endDate: string) {
    const allBookings = await bookingRepository.getAll();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredBookings = allBookings.filter((booking) => {
      const checkIn = new Date(booking.checkInDate);
      return checkIn >= start && checkIn <= end;
    });

    return filteredBookings;
  }

  async getBookingsByStatus(
    status:
      | "pending"
      | "confirmed"
      | "cancelled"
      | "checked_in"
      | "checked_out",
  ) {
    const allBookings = await bookingRepository.getAll();
    return allBookings.filter((booking) => booking.status === status);
  }

  async getBookingsByPaymentStatus(
    paymentStatus: "pending" | "paid" | "failed",
  ) {
    const allBookings = await bookingRepository.getAll();
    return allBookings.filter(
      (booking) => booking.paymentStatus === paymentStatus,
    );
  }

  private validateStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): void {
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["checked_in", "cancelled"],
      checked_in: ["checked_out"],
      checked_out: [],
      cancelled: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new HttpError(
        400,
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  async getUpcomingCheckIns(days: number = 7) {
    const allBookings = await bookingRepository.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return allBookings.filter((booking) => {
      const checkIn = new Date(booking.checkInDate);
      return (
        checkIn >= today &&
        checkIn <= futureDate &&
        booking.status === "confirmed"
      );
    });
  }

  async getUpcomingCheckOuts(days: number = 7) {
    const allBookings = await bookingRepository.getAll();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return allBookings.filter((booking) => {
      const checkOut = new Date(booking.checkOutDate);
      return (
        checkOut >= today &&
        checkOut <= futureDate &&
        booking.status === "checked_in"
      );
    });
  }
}
