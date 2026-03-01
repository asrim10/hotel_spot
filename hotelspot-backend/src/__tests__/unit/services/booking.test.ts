import { BookingService } from "../../../services/booking.service";
import { BookingRepository } from "../../../repositories/booking.repositories";
import { HttpError } from "../../../errors/http-error";

jest.mock("../../../config/email");

describe("BookingService", () => {
  let service: BookingService;

  const fakeBooking = {
    _id: "booking123",
    userId: "user123",
    hotelId: "hotel123",
    checkIn: new Date("2025-01-01"),
    checkOut: new Date("2025-01-05"),
    status: "confirmed",
  };

  const repo = {
    create: jest.spyOn(BookingRepository.prototype, "create"),
    getAll: jest.spyOn(BookingRepository.prototype, "getAll"),
    getById: jest.spyOn(BookingRepository.prototype, "getById"),
    getByUserId: jest.spyOn(BookingRepository.prototype, "getByUserId"),
    update: jest.spyOn(BookingRepository.prototype, "update"),
    delete: jest.spyOn(BookingRepository.prototype, "delete"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new BookingService();
  });

  // 1. createBooking: creates and returns a new booking
  it("1. createBooking returns the new booking", async () => {
    repo.create.mockResolvedValue(fakeBooking as any);

    const result = await service.createBooking(fakeBooking as any);

    expect(repo.create).toHaveBeenCalledWith(fakeBooking);
    expect(result).toEqual(fakeBooking);
  });

  // 2. getAllBookings: returns all bookings
  it("2. getAllBookings returns all bookings from repository", async () => {
    repo.getAll.mockResolvedValue([fakeBooking] as any);

    const result = await service.getAllBookings();

    expect(result).toEqual([fakeBooking]);
    expect(repo.getAll).toHaveBeenCalledTimes(1);
  });

  // 3. getAllBookings: returns empty array when no bookings exist
  it("3. getAllBookings returns empty array when none exist", async () => {
    repo.getAll.mockResolvedValue([] as any);

    const result = await service.getAllBookings();

    expect(result).toEqual([]);
  });

  // 4. getBookingById: returns booking when found
  it("4. getBookingById returns booking when found", async () => {
    repo.getById.mockResolvedValue(fakeBooking as any);

    const result = await service.getBookingById("booking123");

    expect(result).toEqual(fakeBooking);
    expect(repo.getById).toHaveBeenCalledWith("booking123");
  });

  // 5. getBookingById: throws 404 when booking not found
  it("5. getBookingById throws 404 when booking not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getBookingById("nonexistent")).rejects.toThrow(
      new HttpError(404, "Booking not found"),
    );
  });

  // 6. getBookingsByUserId: returns bookings for a user
  it("6. getBookingsByUserId returns bookings for the given user", async () => {
    repo.getByUserId.mockResolvedValue([fakeBooking] as any);

    const result = await service.getBookingsByUserId("user123");

    expect(result).toEqual([fakeBooking]);
    expect(repo.getByUserId).toHaveBeenCalledWith("user123");
  });

  // 7. updateBooking: throws 404 when booking not found
  it("7. updateBooking throws 404 when booking not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(
      service.updateBooking("nonexistent", { status: "cancelled" } as any),
    ).rejects.toThrow(new HttpError(404, "Booking not found"));
  });

  // 8. updateBooking: updates and returns the booking
  it("8. updateBooking returns updated booking on success", async () => {
    const updated = { ...fakeBooking, status: "cancelled" };
    repo.getById.mockResolvedValue(fakeBooking as any);
    repo.update.mockResolvedValue(updated as any);

    const result = await service.updateBooking("booking123", {
      status: "cancelled",
    } as any);

    expect(repo.update).toHaveBeenCalledWith("booking123", {
      status: "cancelled",
    });
    expect(result).toEqual(updated);
  });

  // 9. deleteBooking: throws 404 when booking not found
  it("9. deleteBooking throws 404 when booking not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.deleteBooking("nonexistent")).rejects.toThrow(
      new HttpError(404, "Booking not found"),
    );
  });

  // 10. deleteBooking: deletes and returns result when found
  it("10. deleteBooking calls delete and returns result when found", async () => {
    repo.getById.mockResolvedValue(fakeBooking as any);
    repo.delete.mockResolvedValue(true as any);

    const result = await service.deleteBooking("booking123");

    expect(repo.delete).toHaveBeenCalledWith("booking123");
    expect(result).toBe(true);
  });
});
