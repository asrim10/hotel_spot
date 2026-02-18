import { CreateBookingDTO, UpdateBookingDTO } from "../../dtos/booking.dto";
import { HttpError } from "../../errors/http-error";
import { BookingRepository } from "../../repositories/booking.repositories";

let bookingRepository = new BookingRepository();

export class AdminBookingService {
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
    // Validate check-in and check-out dates
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    if (checkOut <= checkIn) {
      throw new HttpError(400, "Check-out date must be after check-in date");
    }

    // Ensure check-in date is not in the past
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

    // Validate status transitions
    this.validateStatusTransition(booking.status, status);

    const updatedBooking = await bookingRepository.update(id, { status });
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

    // Prevent updating cancelled bookings
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

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      throw new HttpError(400, "Booking is already cancelled");
    }

    if (booking.status === "checked_out") {
      throw new HttpError(400, "Cannot cancel a completed booking");
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "cancelled",
    });

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

    // Verify check-in date
    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);

    if (checkInDate > today) {
      throw new HttpError(400, "Cannot check-in before check-in date");
    }

    const updatedBooking = await bookingRepository.update(id, {
      status: "checked_in",
    });

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

    return updatedBooking;
  }

  async deleteBooking(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    // Only allow deletion of cancelled or old completed bookings
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
      total: allBookings.length,
      pending: allBookings.filter((b) => b.status === "pending").length,
      confirmed: allBookings.filter((b) => b.status === "confirmed").length,
      checkedIn: allBookings.filter((b) => b.status === "checked_in").length,
      checkedOut: allBookings.filter((b) => b.status === "checked_out").length,
      cancelled: allBookings.filter((b) => b.status === "cancelled").length,

      // Payment stats
      paymentPending: allBookings.filter((b) => b.paymentStatus === "pending")
        .length,
      paymentPaid: allBookings.filter((b) => b.paymentStatus === "paid").length,
      paymentFailed: allBookings.filter((b) => b.paymentStatus === "failed")
        .length,

      // Revenue (only paid bookings)
      totalRevenue: allBookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + b.totalPrice, 0),

      // Today's check-ins
      todayCheckIns: allBookings.filter((b) => {
        const checkInDate = new Date(b.checkInDate);
        const today = new Date();
        return (
          checkInDate.toDateString() === today.toDateString() &&
          b.status === "confirmed"
        );
      }).length,

      // Today's check-outs
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
      checked_out: [], // Final state
      cancelled: [], // Final state
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

  /**
   * Get upcoming check-outs (next 7 days)
   */
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
