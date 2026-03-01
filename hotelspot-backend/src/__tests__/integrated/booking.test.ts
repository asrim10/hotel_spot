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
    // clean up
    await UserModel.deleteMany({ email: testUser.email });
    await BookingModel.deleteMany({ email: validPayload.email });

    // create user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await UserModel.create({
      username: testUser.username,
      email: testUser.email,
      password: hashedPassword,
      fullName: testUser.fullName,
      role: "user",
    });

    // login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;
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

      // save id for later tests
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

  // GET /api/bookings/me
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

  // GET /api/bookings/:id
  describe("GET /api/bookings/:id", () => {
    test("returns a booking by id", async () => {
      expect(testBookingId).toBeDefined();

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

  // PUT /api/bookings/:id
  describe("PUT /api/bookings/:id", () => {
    test("updates booking status", async () => {
      expect(testBookingId).toBeDefined();

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

  // DELETE /api/bookings/:id
  describe("DELETE /api/bookings/:id", () => {
    test("deletes a booking", async () => {
      expect(testBookingId).toBeDefined();

      const res = await request(app)
        .delete(`/api/bookings/${testBookingId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);

      // confirm it's gone
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
