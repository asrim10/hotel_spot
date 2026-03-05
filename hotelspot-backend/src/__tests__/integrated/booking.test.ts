import request from "supertest";
import app from "../../app";
import { BookingModel } from "../../models/booking.model";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("Booking Routes", () => {
  let authToken: string;
  let testBookingId: string;

  const testUser = {
    username: "bookinguser",
    email: "bookinguser@example.com",
    password: "password123",
    fullName: "Booking User",
  };

  const validPayload = {
    hotelId: new mongoose.Types.ObjectId().toString(),
    fullName: "John Doe",
    email: "john@example.com",
    checkInDate: "2026-04-01",
    checkOutDate: "2026-04-05",
    totalPrice: 500,
    paymentMethod: "card",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: testUser.email }, { username: testUser.username }],
    });
    await BookingModel.deleteMany({ email: validPayload.email });

    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await UserModel.create({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
      fullName: testUser.fullName,
      role: "user",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    if (loginRes.status !== 200) {
      throw new Error(
        `beforeAll login failed with status ${loginRes.status}: ${JSON.stringify(loginRes.body)}`,
      );
    }

    authToken = loginRes.body.token;

    if (!authToken) {
      throw new Error(
        "Login succeeded but token was missing from response body",
      );
    }
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    await BookingModel.deleteMany({ email: validPayload.email });
  });

  // POST /api/bookings
  describe("POST /api/bookings", () => {
    test("creates a booking", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${authToken}`)
        .send(validPayload);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Booking Created");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("status", "pending");

      testBookingId = res.body.data._id;
    });

    test("returns 401 without token", async () => {
      const res = await request(app).post("/api/bookings").send(validPayload);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 when fields are missing", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ fullName: "John" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 when totalPrice is negative", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...validPayload, totalPrice: -100 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 for invalid paymentMethod", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ ...validPayload, paymentMethod: "bitcoin" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/bookings/me", () => {
    test("returns bookings for logged in user", async () => {
      const res = await request(app)
        .get("/api/bookings/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/bookings/me");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/bookings/:id", () => {
    test("returns a booking by id", async () => {
      if (!testBookingId) {
        throw new Error(
          "testBookingId is not set — the POST 'creates a booking' test must pass first",
        );
      }

      const res = await request(app)
        .get(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id", testBookingId);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .get("/api/bookings/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 404 when booking does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .get(`/api/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("PUT /api/bookings/:id", () => {
    test("updates booking status", async () => {
      if (!testBookingId) {
        throw new Error(
          "testBookingId is not set — the POST 'creates a booking' test must pass first",
        );
      }

      const res = await request(app)
        .put(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "confirmed" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("status", "confirmed");
    });

    test("updates paymentStatus", async () => {
      const res = await request(app)
        .put(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ paymentStatus: "paid" });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("paymentStatus", "paid");
    });

    test("returns 400 for invalid status value", async () => {
      const res = await request(app)
        .put(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "wrong_status" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 404 when booking does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .put(`/api/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "confirmed" });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .put("/api/bookings/bad-id")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "confirmed" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    test("deletes a booking", async () => {
      if (!testBookingId) {
        throw new Error(
          "testBookingId is not set — the POST 'creates a booking' test must pass first",
        );
      }

      const res = await request(app)
        .delete(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      const getRes = await request(app)
        .get(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    test("returns 404 when booking does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .delete(`/api/bookings/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .delete("/api/bookings/bad-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).delete(`/api/bookings/${testBookingId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
