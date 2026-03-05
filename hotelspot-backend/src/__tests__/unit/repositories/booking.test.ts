import { BookingModel } from "../../../models/booking.model";
import { UserModel } from "../../../models/user.model";
import { HotelModel } from "../../../models/hotel.model";
import mongoose from "mongoose";
import { BookingRepository } from "../../../repositories/booking.repositories";

describe("Booking Repository Unit Tests", () => {
  let bookingRepository: BookingRepository;
  let testUserId: string;
  let testHotelId: string;

  beforeAll(async () => {
    bookingRepository = new BookingRepository();

    await UserModel.deleteMany({ email: "bookinguser@example.com" });
    await HotelModel.deleteMany({ hotelName: "Booking Test Hotel" });

    const user = await UserModel.create({
      username: "bookinguser",
      email: "bookinguser@example.com",
      password: "Password123!",
      fullName: "Booking User",
      role: "user" as const,
    });
    testUserId = user._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Booking Test Hotel",
      address: "123 Booking Street",
      city: "Booking City",
      country: "Booking Country",
      rating: 4.0,
      description: "A test hotel for bookings",
      price: 200,
      availableRooms: 5,
    });
    testHotelId = hotel._id.toString();
  });

  afterEach(async () => {
    await BookingModel.deleteMany({ userId: testUserId });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "bookinguser@example.com" });
    await HotelModel.deleteMany({ hotelName: "Booking Test Hotel" });
  });

  const getBookingData = (overrides = {}) => ({
    userId: testUserId,
    hotelId: testHotelId,
    fullName: "Booking User",
    email: "bookinguser@example.com",
    checkInDate: new Date("2025-06-01"),
    checkOutDate: new Date("2025-06-07"),
    guests: 2,
    totalPrice: 1200,
    status: "pending",
    paymentStatus: "pending",
    ...overrides,
  });

  test("should create a new booking", async () => {
    const newBooking = await bookingRepository.create(getBookingData());
    expect(newBooking).toBeDefined();
    expect(newBooking.fullName).toBe("Booking User");
    expect(newBooking.totalPrice).toBe(1200);
    expect(newBooking.status).toBe("pending");
  });

  test("should get a booking by ID", async () => {
    const newBooking = await bookingRepository.create(getBookingData());
    const found = await bookingRepository.getById(newBooking._id.toString());
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(newBooking._id.toString());
  });

  test("should return null when getting a booking by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await bookingRepository.getById(fakeId);
    expect(found).toBeNull();
  });

  test("should get all bookings", async () => {
    await bookingRepository.create(getBookingData());
    const bookings = await bookingRepository.getAll();
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
  });

  test("should get paginated bookings without search", async () => {
    await bookingRepository.create(getBookingData());
    const result = await bookingRepository.getAllPaginated(1, 10);
    expect(result).toBeDefined();
    expect(Array.isArray(result.bookings)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  test("should get paginated bookings with search query", async () => {
    await bookingRepository.create(getBookingData());
    const result = await bookingRepository.getAllPaginated(1, 10, "pending");
    expect(result).toBeDefined();
    expect(Array.isArray(result.bookings)).toBe(true);
    expect(result.bookings.length).toBeGreaterThan(0);
  });

  test("should return empty array when search query has no match", async () => {
    await bookingRepository.create(getBookingData());
    const result = await bookingRepository.getAllPaginated(
      1,
      10,
      "nonexistentquery999",
    );
    expect(result.bookings.length).toBe(0);
    expect(result.total).toBe(0);
  });

  test("should get all bookings by user ID", async () => {
    await bookingRepository.create(getBookingData());
    const bookings = await bookingRepository.getByUserId(testUserId);
    expect(Array.isArray(bookings)).toBe(true);
    expect(bookings.length).toBeGreaterThan(0);
    expect(bookings[0].userId.toString()).toBe(testUserId);
  });

  test("should update a booking", async () => {
    const newBooking = await bookingRepository.create(getBookingData());
    const updated = await bookingRepository.update(newBooking._id.toString(), {
      status: "confirmed",
      paymentStatus: "paid",
    });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe("confirmed");
    expect(updated?.paymentStatus).toBe("paid");
  });

  test("should delete a booking by ID", async () => {
    const newBooking = await bookingRepository.create(getBookingData());
    const result = await bookingRepository.delete(newBooking._id.toString());
    expect(result).toBe(true);

    const deleted = await bookingRepository.getById(newBooking._id.toString());
    expect(deleted).toBeNull();
  });
});
