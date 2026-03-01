import { BookingModel } from "../../../models/booking.model";
import { UserModel } from "../../../models/user.model";
import { HotelModel } from "../../../models/hotel.model";
import mongoose from "mongoose";
import { PaymentRepository } from "../../../repositories/payment.repositories";

describe("Payment Repository Unit Tests", () => {
  let paymentRepository: PaymentRepository;
  let testUserId: string;
  let testHotelId: string;
  let testBookingId: string;

  beforeAll(async () => {
    paymentRepository = new PaymentRepository();

    const user = await UserModel.create({
      username: "paymentuser",
      email: "paymentuser@example.com",
      password: "Password123!",
      fullName: "Payment User",
      role: "user" as const,
    });
    testUserId = user._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Payment Test Hotel",
      address: "123 Payment Street",
      city: "Payment City",
      country: "Payment Country",
      rating: 4.0,
      description: "A test hotel for payments",
      price: 200,
      availableRooms: 5,
    });
    testHotelId = hotel._id.toString();
  });

  beforeEach(async () => {
    // Create a fresh booking before each test
    const booking = await BookingModel.create({
      userId: testUserId,
      hotelId: testHotelId,
      fullName: "Payment User",
      email: "paymentuser@example.com",
      checkInDate: "2025-06-01",
      checkOutDate: "2025-06-07",
      totalPrice: 1200,
      status: "pending",
      paymentStatus: "pending",
    });
    testBookingId = booking._id.toString();
  });

  afterEach(async () => {
    await BookingModel.deleteMany({ userId: testUserId });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "paymentuser@example.com" });
    await HotelModel.deleteMany({ hotelName: "Payment Test Hotel" });
    await mongoose.connection.close();
  });

  // 1. Save Pidx
  test("should save pidx to a booking", async () => {
    const updated = await paymentRepository.savePidx(testBookingId, "pidx_001");
    expect(updated).toBeDefined();
    expect(updated?.pidx).toBe("pidx_001");
  });

  // 2. Save Pidx - Not Found
  test("should return null when saving pidx to a non-existent booking", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const updated = await paymentRepository.savePidx(fakeId, "pidx_fake");
    expect(updated).toBeNull();
  });

  // 3. Get By Pidx
  test("should get a booking by pidx", async () => {
    await paymentRepository.savePidx(testBookingId, "pidx_002");
    const booking = await paymentRepository.getByPidx("pidx_002");
    expect(booking).toBeDefined();
    expect(booking?.pidx).toBe("pidx_002");
  });

  // 4. Get By Pidx - Not Found
  test("should return null when getting a booking by non-existent pidx", async () => {
    const booking = await paymentRepository.getByPidx("pidx_nonexistent");
    expect(booking).toBeNull();
  });

  // 5. Confirm Payment
  test("should confirm payment and update booking status", async () => {
    await paymentRepository.savePidx(testBookingId, "pidx_003");
    const updated = await paymentRepository.confirmPayment(
      "pidx_003",
      "txn_abc123",
    );
    expect(updated).toBeDefined();
    expect(updated?.paymentStatus).toBe("paid");
    expect(updated?.status).toBe("confirmed");
    expect(updated?.paymentMethod).toBe("online");
    expect(updated?.transactionId).toBe("txn_abc123");
  });

  // 6. Confirm Payment - Not Found
  test("should return null when confirming payment with non-existent pidx", async () => {
    const updated = await paymentRepository.confirmPayment(
      "pidx_nonexistent",
      "txn_xyz",
    );
    expect(updated).toBeNull();
  });

  // 7. Fail Payment
  test("should mark payment as failed", async () => {
    await paymentRepository.savePidx(testBookingId, "pidx_004");
    const updated = await paymentRepository.failPayment("pidx_004");
    expect(updated).toBeDefined();
    expect(updated?.paymentStatus).toBe("failed");
  });

  // 8. Fail Payment - Not Found
  test("should return null when failing payment with non-existent pidx", async () => {
    const updated = await paymentRepository.failPayment("pidx_nonexistent");
    expect(updated).toBeNull();
  });

  // 9. Confirm Payment preserves booking data
  test("should preserve booking data after confirming payment", async () => {
    await paymentRepository.savePidx(testBookingId, "pidx_005");
    const updated = await paymentRepository.confirmPayment(
      "pidx_005",
      "txn_def456",
    );
    expect(updated).toBeDefined();
    expect(updated?.totalPrice).toBe(1200);
    expect(updated?.userId.toString()).toBe(testUserId);
    expect(updated?.hotelId.toString()).toBe(testHotelId);
  });

  // 10. Save Pidx then Get By Pidx full flow
  test("should save pidx and retrieve booking by pidx correctly", async () => {
    await paymentRepository.savePidx(testBookingId, "pidx_006");
    const booking = await paymentRepository.getByPidx("pidx_006");
    expect(booking).toBeDefined();
    expect(booking?._id.toString()).toBe(testBookingId);
    expect(booking?.paymentStatus).toBe("pending");
    expect(booking?.status).toBe("pending");
  });
});
