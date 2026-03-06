import request from "supertest";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { BookingModel } from "../../../models/booking.model";
import { UserModel } from "../../../models/user.model";
import { HotelModel } from "../../../models/hotel.model";
import app from "../../../app";

// Helper: create a fresh booking in any given status
const makeBooking = async (
  userId: string,
  hotelId: string,
  email: string,
  status: string = "pending",
  checkInDate: string = "2026-06-01",
  checkOutDate: string = "2026-06-05",
) => {
  const booking = await BookingModel.create({
    userId,
    hotelId,
    fullName: "Admin Booking User",
    email,
    checkInDate,
    checkOutDate,
    totalPrice: 800,
    status,
    paymentStatus: "pending",
    paymentMethod: "card",
  });
  return (booking as any)._id.toString();
};

describe("Admin Booking Routes", () => {
  let adminToken: string;
  let testUserId: string;
  let testHotelId: string;

  const adminUser = {
    username: "adminbooking",
    email: "adminbooking@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: adminUser.email }, { username: adminUser.username }],
    });
    await HotelModel.deleteMany({ hotelName: "Admin Booking Hotel" });

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = await UserModel.create({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      fullName: "Admin Booking",
      role: "admin",
    });
    testUserId = admin._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Admin Booking Hotel",
      address: "123 Admin St",
      city: "Admin City",
      country: "Admin Country",
      rating: 4.0,
      description: "Hotel for admin booking tests",
      price: 200,
      availableRooms: 10,
    });
    testHotelId = hotel._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });

    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await BookingModel.deleteMany({ userId: testUserId });
    await HotelModel.deleteMany({ hotelName: "Admin Booking Hotel" });
    await UserModel.deleteMany({ email: adminUser.email });
  });

  describe("GET /api/admin/bookings", () => {
    test("returns all bookings for admin", async () => {
      const res = await request(app)
        .get("/api/admin/bookings")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "Bookings retrieved successfully",
      );
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/admin/bookings");
      expect(res.status).toBe(401);
    });

    test("supports pagination params", async () => {
      const res = await request(app)
        .get("/api/admin/bookings?page=1&size=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("pagination");
    });

    test("supports search param", async () => {
      const res = await request(app)
        .get("/api/admin/bookings?search=pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });

  describe("GET /api/admin/bookings/:id", () => {
    test("returns a booking by id", async () => {
      const id = await makeBooking(testUserId, testHotelId, adminUser.email);
      const res = await request(app)
        .get(`/api/admin/bookings/${id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("_id", id);
    });

    test("returns 404 for non-existent booking", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/admin/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/admin/bookings/user/:userId", () => {
    test("returns bookings for a user", async () => {
      const res = await request(app)
        .get(`/api/admin/bookings/user/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("POST /api/admin/bookings", () => {
    test("creates a booking", async () => {
      const res = await request(app)
        .post("/api/admin/bookings")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          userId: testUserId,
          hotelId: testHotelId,
          fullName: "New Admin Booking",
          email: "newbooking@example.com",
          checkInDate: "2026-07-01",
          checkOutDate: "2026-07-05",
          totalPrice: 1000,
          paymentMethod: "card",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Booking created successfully",
      );
    });

    test("returns 401 without token", async () => {
      const res = await request(app).post("/api/admin/bookings").send({});
      expect(res.status).toBe(401);
    });
  });

  describe("PATCH /api/admin/bookings/:id/status", () => {
    test("updates booking status pending → confirmed", async () => {
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "pending",
      );
      const res = await request(app)
        .patch(`/api/admin/bookings/${id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "confirmed" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Booking status updated successfully",
      );
    });

    test("returns 400 when status is missing", async () => {
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "pending",
      );
      const res = await request(app)
        .patch(`/api/admin/bookings/${id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("PATCH /api/admin/bookings/:id/payment-status", () => {
    test("updates payment status", async () => {
      const id = await makeBooking(testUserId, testHotelId, adminUser.email);
      const res = await request(app)
        .patch(`/api/admin/bookings/${id}/payment-status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ paymentStatus: "paid" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Payment status updated successfully",
      );
    });

    test("returns 400 when paymentStatus is missing", async () => {
      const id = await makeBooking(testUserId, testHotelId, adminUser.email);
      const res = await request(app)
        .patch(`/api/admin/bookings/${id}/payment-status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/admin/bookings/:id/confirm", () => {
    test("confirms a pending booking", async () => {
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "pending",
      );
      const res = await request(app)
        .post(`/api/admin/bookings/${id}/confirm`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Booking confirmed successfully",
      );
    });
  });

  describe("POST /api/admin/bookings/:id/cancel", () => {
    test("cancels a pending booking", async () => {
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "pending",
      );
      const res = await request(app)
        .post(`/api/admin/bookings/${id}/cancel`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ reason: "Test cancellation" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Booking cancelled successfully",
      );
    });
  });

  describe("POST /api/admin/bookings/:id/check-in", () => {
    test("checks in a confirmed booking with a past checkInDate", async () => {
      // checkIn requires status=confirmed AND checkInDate <= today
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "confirmed",
        "2025-01-01", // past date satisfies the date guard
        "2025-01-05",
      );
      const res = await request(app)
        .post(`/api/admin/bookings/${id}/check-in`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Guest checked in successfully",
      );
    });
  });

  describe("POST /api/admin/bookings/:id/check-out", () => {
    test("checks out a checked_in booking", async () => {
      // checkOut requires status=checked_in
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "checked_in",
        "2025-01-01",
        "2025-01-05",
      );
      const res = await request(app)
        .post(`/api/admin/bookings/${id}/check-out`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Guest checked out successfully",
      );
    });
  });

  describe("DELETE /api/admin/bookings/:id", () => {
    test("deletes a cancelled booking", async () => {
      // delete requires status=cancelled or checked_out
      const id = await makeBooking(
        testUserId,
        testHotelId,
        adminUser.email,
        "cancelled",
      );
      const res = await request(app)
        .delete(`/api/admin/bookings/${id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Booking deleted successfully",
      );
    });

    test("returns 404 for non-existent booking", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/api/admin/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
    });

    test("returns 401 without token", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/admin/bookings/${fakeId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/admin/bookings/analytics/stats", () => {
    test("returns booking statistics", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/analytics/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "message",
        "Booking statistics retrieved successfully",
      );
    });
  });

  describe("GET /api/admin/bookings/status/:status", () => {
    test("returns bookings by status", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/status/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/admin/bookings/payment-status/:paymentStatus", () => {
    test("returns bookings by payment status", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/payment-status/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/admin/bookings/filter/date-range", () => {
    test("returns bookings by date range", async () => {
      const res = await request(app)
        .get(
          "/api/admin/bookings/filter/date-range?start=2026-01-01&end=2026-12-31",
        )
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    test("returns 400 when dates are missing", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/filter/date-range")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/admin/bookings/upcoming/check-ins", () => {
    test("returns upcoming check-ins", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/upcoming/check-ins")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/admin/bookings/upcoming/check-outs", () => {
    test("returns upcoming check-outs", async () => {
      const res = await request(app)
        .get("/api/admin/bookings/upcoming/check-outs")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
