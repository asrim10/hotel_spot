import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { HotelModel } from "../../models/hotel.model";
import { BookingModel } from "../../models/booking.model";
import bcrypt from "bcryptjs";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Payment Routes", () => {
  let authToken: string;
  let testBookingId: string;

  const userData = {
    username: "paymentuser",
    email: "paymentuser@example.com",
    password: "password123",
    fullName: "Payment User",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({ email: userData.email });
    await HotelModel.deleteMany({ hotelName: "Payment Test Hotel" });

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const testUser = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      role: "user",
    });

    const hotel = await HotelModel.create({
      hotelName: "Payment Test Hotel",
      address: "123 Test St",
      city: "Test City",
      country: "Test Country",
      price: 200,
      availableRooms: 5,
    });

    const booking = await BookingModel.create({
      userId: testUser._id.toString(),
      hotelId: hotel._id.toString(),
      fullName: userData.fullName,
      email: userData.email,
      checkInDate: "2026-04-01",
      checkOutDate: "2026-04-05",
      totalPrice: 800,
      paymentMethod: "online",
      status: "pending",
      paymentStatus: "pending",
    });
    testBookingId = booking._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginRes.status).toBe(200);
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await BookingModel.deleteMany({ _id: testBookingId });
    await HotelModel.deleteMany({ hotelName: "Payment Test Hotel" });
    await UserModel.deleteMany({ email: userData.email });
    jest.resetAllMocks();
  });

  // POST /api/payment/khalti/initiate
  describe("POST /api/payment/khalti/initiate", () => {
    test("initiates payment and returns pidx and payment_url", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          pidx: "test_pidx_abc123",
          payment_url: "https://dev.khalti.com/pay/test_pidx_abc123",
        },
      });

      const res = await request(app)
        .post("/api/payment/khalti/initiate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookingId: testBookingId,
          totalPrice: 800,
          fullName: userData.fullName,
          email: userData.email,
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("pidx", "test_pidx_abc123");
      expect(res.body).toHaveProperty(
        "payment_url",
        "https://dev.khalti.com/pay/test_pidx_abc123",
      );
    });

    test("returns 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/payment/khalti/initiate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ bookingId: testBookingId });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    test("returns 400 when totalPrice is 0 or negative", async () => {
      const res = await request(app)
        .post("/api/payment/khalti/initiate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookingId: testBookingId,
          totalPrice: 0,
          fullName: userData.fullName,
          email: userData.email,
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    test("returns 400 for invalid email", async () => {
      const res = await request(app)
        .post("/api/payment/khalti/initiate")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          bookingId: testBookingId,
          totalPrice: 800,
          fullName: userData.fullName,
          email: "not-an-email",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });
  });

  // POST /api/payment/khalti/verify
  describe("POST /api/payment/khalti/verify", () => {
    test("verifies payment successfully when Khalti status is Completed", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status: "Completed",
          transaction_id: "txn_abc123",
          purchase_order_id: testBookingId,
          total_amount: 80000,
        },
      });

      const res = await request(app)
        .post("/api/payment/khalti/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ pidx: "test_pidx_abc123" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("transactionId", "txn_abc123");
      expect(res.body).toHaveProperty("amount", 800);
    });

    test("returns 400 when Khalti status is Pending", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status: "Pending",
          transaction_id: null,
          purchase_order_id: testBookingId,
          total_amount: 0,
        },
      });

      const res = await request(app)
        .post("/api/payment/khalti/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ pidx: "test_pidx_abc123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("status", "Pending");
    });

    test("returns 400 when Khalti status is Expired", async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          status: "Expired",
          transaction_id: null,
          purchase_order_id: testBookingId,
          total_amount: 0,
        },
      });

      const res = await request(app)
        .post("/api/payment/khalti/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ pidx: "test_pidx_abc123" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("status", "Expired");
    });

    test("returns 400 when pidx is missing", async () => {
      const res = await request(app)
        .post("/api/payment/khalti/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });
  });
});
