import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { HttpError } from "../errors/http-error";
import { BookingRepository } from "../repositories/booking.repositories";

let bookingRepository = new BookingRepository();

export class BookingService {
  async createBooking(data: CreateBookingDTO) {
    const newBooking = await bookingRepository.create(data);
    return newBooking;
  }

  async getAllBookings() {
    const bookings = await bookingRepository.getAll();
    return bookings;
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

  async updateBooking(id: string, updateData: UpdateBookingDTO) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const updatedBooking = await bookingRepository.update(id, updateData);
    return updatedBooking;
  }

  async deleteBooking(id: string) {
    const booking = await bookingRepository.getById(id);

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    const deleted = await bookingRepository.delete(id);
    return deleted;
  }
}
