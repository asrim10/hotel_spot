import request from "supertest";
import app from "../../app";
import { FavouriteModel } from "../../models/favourite.model";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("Favourite Routes", () => {
  let authToken: string;
  let testFavouriteId: string;
  let testHotelId: string;

  const testUser = {
    username: "favuser",
    email: "favuser@example.com",
    password: "password123",
    fullName: "Fav User",
  };

  beforeAll(async () => {
    // clean up
    await UserModel.deleteMany({ email: testUser.email });

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

    // hotel id to reuse across tests
    testHotelId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    await FavouriteModel.deleteMany({ hotelId: testHotelId });
  });

  // POST /api/favourites
  describe("POST /api/favourites", () => {
    test("adds a hotel to favourites", async () => {
      const res = await request(app)
        .post("/api/fav")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ hotelId: testHotelId });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Hotel added to favourites");
      expect(res.body.data).toHaveProperty("_id");
      expect(res.body.data).toHaveProperty("hotelId", testHotelId);

      // save id for later tests
      testFavouriteId = res.body.data._id;
    });

    test("returns 409 when hotel already in favourites", async () => {
      const res = await request(app)
        .post("/api/fav")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ hotelId: testHotelId });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 when hotelId is missing", async () => {
      const res = await request(app)
        .post("/api/fav")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/fav")
        .send({ hotelId: testHotelId });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/favourites/me
  describe("GET /api/favourites/me", () => {
    test("returns favourites for logged in user", async () => {
      const res = await request(app)
        .get("/api/fav/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/fav/me");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/favourites/:id
  describe("GET /api/favourites/:id", () => {
    test("returns a favourite by id", async () => {
      expect(testFavouriteId).toBeDefined();

      const res = await request(app)
        .get(`/api/fav/${testFavouriteId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toHaveProperty("_id", testFavouriteId);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .get("/api/fav/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 404 when favourite does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app)
        .get(`/api/fav/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // DELETE /api/favourites/:id
  describe("DELETE /api/favourites/:id", () => {
    test("removes a favourite", async () => {
      expect(testFavouriteId).toBeDefined();

      const res = await request(app)
        .delete(`/api/fav/${testFavouriteId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Favourite removed");

      // confirm it's gone
      const getRes = await request(app)
        .get(`/api/fav/${testFavouriteId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .delete("/api/fav/bad-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).delete(`/api/fav/${fakeId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
