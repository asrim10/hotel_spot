import request from "supertest";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { HotelModel } from "../../../models/hotel.model";
import { UserModel } from "../../../models/user.model";
import { ReviewModel } from "../../../models/review.model";
import app from "../../../app";

describe("Admin Review Routes", () => {
  let adminToken: string;
  let testReviewId: string;
  let testUserId: string;
  let testHotelId: string;

  const adminUser = {
    username: "adminreview",
    email: "adminreview@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: adminUser.email }, { username: adminUser.username }],
    });
    await HotelModel.deleteMany({ hotelName: "Admin Review Hotel" });

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = await UserModel.create({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      fullName: "Admin Review",
      role: "admin",
    });
    testUserId = admin._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Admin Review Hotel",
      address: "123 Review St",
      city: "Review City",
      country: "Review Country",
      rating: 4.0,
      description: "Hotel for admin review tests",
      price: 150,
      availableRooms: 5,
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

    const review = await ReviewModel.create({
      userId: testUserId,
      hotelId: testHotelId,
      fullName: "Admin Review User",
      email: adminUser.email,
      rating: 4,
      comment: "Great hotel for testing!",
    });
    testReviewId = review._id.toString();
  });

  afterAll(async () => {
    await ReviewModel.deleteMany({ userId: testUserId });
    await HotelModel.deleteMany({ hotelName: "Admin Review Hotel" });
    await UserModel.deleteMany({ email: adminUser.email });
  });

  describe("GET /api/admin/reviews", () => {
    test("returns all reviews", async () => {
      const res = await request(app)
        .get("/api/admin/reviews")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "Reviews retrieved successfully",
      );
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/admin/reviews");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });

    test("supports pagination", async () => {
      const res = await request(app)
        .get("/api/admin/reviews?page=1&size=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("pagination");
    });
  });

  describe("GET /api/admin/reviews/stats/all", () => {
    test("returns review statistics", async () => {
      const res = await request(app)
        .get("/api/admin/reviews/stats/all")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "Review statistics retrieved successfully",
      );
    });
  });

  describe("GET /api/admin/reviews/:id", () => {
    test("returns a review by id", async () => {
      const res = await request(app)
        .get(`/api/admin/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id", testReviewId);
    });

    test("returns 404 for non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/admin/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/admin/reviews/user/:userId", () => {
    test("returns reviews by user id", async () => {
      const res = await request(app)
        .get(`/api/admin/reviews/user/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("GET /api/admin/reviews/hotel/:hotelId", () => {
    test("returns reviews by hotel id", async () => {
      const res = await request(app)
        .get(`/api/admin/reviews/hotel/${testHotelId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PUT /api/admin/reviews/:id", () => {
    test("updates a review", async () => {
      const res = await request(app)
        .put(`/api/admin/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ rating: 5, comment: "Updated by admin" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Review updated successfully");
    });

    test("returns 404 for non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/admin/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ rating: 5, comment: "Updated" });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app)
        .put(`/api/admin/reviews/${testReviewId}`)
        .send({ rating: 3 });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/reviews/:id", () => {
    test("deletes a review", async () => {
      const res = await request(app)
        .delete(`/api/admin/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Review deleted successfully");
    });

    test("returns 404 for non-existent review", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/api/admin/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).delete(
        `/api/admin/reviews/${testReviewId}`,
      );
      expect(res.status).toBe(401);
    });
  });
});
