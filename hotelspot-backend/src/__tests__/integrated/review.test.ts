import request from "supertest";
import app from "../../app";
import { ReviewModel } from "../../models/review.model";
import { UserModel } from "../../models/user.model";
import { HotelModel } from "../../models/hotel.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("Review Routes", () => {
  let authToken: string;
  let testReviewId: string;
  let testHotelId: string;
  let testUser: any;

  const userData = {
    username: "reviewuser",
    email: "reviewuser@example.com",
    password: "password123",
    fullName: "Review User",
  };

  beforeAll(async () => {
    // clean up
    await UserModel.deleteMany({ email: userData.email });
    await HotelModel.deleteMany({ hotelName: "Review Test Hotel" });

    // create user
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    testUser = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      role: "user",
    });

    // create a real hotel so updateHotelRating works
    const hotel = await HotelModel.create({
      hotelName: "Review Test Hotel",
      address: "123 Test St",
      city: "Test City",
      country: "Test Country",
      price: 100,
      availableRooms: 10,
    });
    testHotelId = hotel._id.toString();

    // login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: userData.email });
    await ReviewModel.deleteMany({ hotelId: testHotelId });
    await HotelModel.deleteMany({ hotelName: "Review Test Hotel" });
  });

  // POST /api/reviews
  describe("POST /api/reviews", () => {
    test("creates a review", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          hotelId: testHotelId,
          rating: 4,
          comment: "Great hotel stay!",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Review created successfully");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("rating", 4);

      // save id for later tests
      testReviewId = res.body.data._id;
    });

    test("returns 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ hotelId: testHotelId });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/reviews")
        .send({ hotelId: testHotelId, rating: 4, comment: "Nice place" });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/reviews/me
  describe("GET /api/reviews/me", () => {
    test("returns reviews for logged in user", async () => {
      const res = await request(app)
        .get("/api/reviews/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/reviews/me");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/reviews/hotel/:hotelId
  describe("GET /api/reviews/hotel/:hotelId", () => {
    test("returns reviews for a hotel", async () => {
      const res = await request(app)
        .get(`/api/reviews/hotel/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("returns 400 for invalid hotel id format", async () => {
      const res = await request(app)
        .get("/api/reviews/hotel/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/reviews/:id
  describe("GET /api/reviews/:id", () => {
    test("returns a review by id", async () => {
      expect(testReviewId).toBeDefined();

      const res = await request(app)
        .get(`/api/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id", testReviewId);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .get("/api/reviews/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 404 when review does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .get(`/api/reviews/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // PUT /api/reviews/:id
  describe("PUT /api/reviews/:id", () => {
    test("updates a review", async () => {
      expect(testReviewId).toBeDefined();

      const res = await request(app)
        .put(`/api/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ rating: 5, comment: "Updated - even better than I thought!" });

      console.log("PUT /api/reviews/:id response:", res.body);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("rating", 5);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .put("/api/reviews/bad-id")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ rating: 3 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app)
        .put(`/api/reviews/${testReviewId}`)
        .send({ rating: 3 });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // DELETE /api/reviews/:id
  describe("DELETE /api/reviews/:id", () => {
    test("deletes a review", async () => {
      expect(testReviewId).toBeDefined();

      const res = await request(app)
        .delete(`/api/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${authToken}`);

      console.log("DELETE /api/reviews/:id response:", res.body);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Review deleted successfully");

      // confirm it's gone
      const getRes = await request(app)
        .get(`/api/reviews/${testReviewId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .delete("/api/reviews/bad-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).delete(`/api/reviews/${fakeId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
