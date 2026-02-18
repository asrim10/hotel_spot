import { QueryFilter } from "mongoose";
import { BookingModel, IBooking } from "../models/booking.model";

export interface IBookingRepository {
  create(bookingData: any): Promise<IBooking>;
  getById(bookingId: string): Promise<IBooking | null>;
  update(bookingId: string, bookingData: any): Promise<IBooking | null>;
  delete(bookingId: string): Promise<boolean>;
  getAll(): Promise<IBooking[]>;
  getAllPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ bookings: IBooking[]; total: number }>;
  getByUserId(userId: string): Promise<IBooking[]>;
}

export class BookingRepository implements IBookingRepository {
  async create(bookingData: any): Promise<IBooking> {
    const booking = new BookingModel(bookingData);
    const newBooking = await booking.save();
    return newBooking;
  }

  async getAllPaginated(page: number, size: number, search?: string) {
    const query: QueryFilter<IBooking> = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { paymentStatus: { $regex: search, $options: "i" } },
      ];
    }

    const total = await BookingModel.countDocuments(query);

    const bookings = await BookingModel.find(query)
      .populate("userId")
      .populate("hotelId")
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 });

    return { bookings, total };
  }

  async getAll(): Promise<IBooking[]> {
    const bookings = await BookingModel.find()
      .populate("userId")
      .populate("hotelId")
      .sort({ createdAt: -1 });

    return bookings;
  }

  async getById(bookingId: string): Promise<IBooking | null> {
    const found = await BookingModel.findById(bookingId)
      .populate("userId")
      .populate("hotelId");

    return found;
  }

  async getByUserId(userId: string): Promise<IBooking[]> {
    const bookings = await BookingModel.find({ userId })
      .populate("hotelId")
      .sort({ createdAt: -1 });

    return bookings;
  }

  async update(bookingId: string, bookingData: any): Promise<IBooking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      bookingData,
      { new: true },
    );

    return updated;
  }

  async delete(bookingId: string): Promise<boolean> {
    const deleted = await BookingModel.findByIdAndDelete(bookingId);
    return deleted !== null;
  }
}
