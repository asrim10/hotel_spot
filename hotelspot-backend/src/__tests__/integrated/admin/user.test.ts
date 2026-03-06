import request from "supertest";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../../../models/user.model";
import app from "../../../app";

describe("Admin User Routes", () => {
  let adminToken: string;
  let testUserId: string;

  const adminUser = {
    username: "adminuser",
    email: "adminuser@example.com",
    password: "password123",
  };

  const targetUser = {
    username: "targetuser",
    email: "targetuser@example.com",
    password: "password123",
    confirmPassword: "password123",
    fullName: "Target User",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: adminUser.email },
        { username: adminUser.username },
        { email: targetUser.email },
        { username: targetUser.username },
      ],
    });

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await UserModel.create({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      fullName: "Admin User",
      role: "admin",
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });

    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    adminToken = loginRes.body.token;

    const hashedTarget = await bcrypt.hash(targetUser.password, 10);
    const created = await UserModel.create({
      username: targetUser.username,
      email: targetUser.email,
      password: hashedTarget,
      fullName: targetUser.fullName,
      role: "user",
    });
    testUserId = created._id.toString();
  });

  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [
        { email: adminUser.email },
        { email: targetUser.email },
        { username: "newadminuser" },
      ],
    });
  });

  describe("GET /api/admin/users", () => {
    test("returns all users", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "All Users Retrieved");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/admin/users");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });

    test("supports pagination", async () => {
      const res = await request(app)
        .get("/api/admin/users?page=1&size=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("pagination");
    });

    test("supports search", async () => {
      const res = await request(app)
        .get(`/api/admin/users?search=${targetUser.username}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
    });
  });

  describe("GET /api/admin/users/:id", () => {
    test("returns a user by id", async () => {
      const res = await request(app)
        .get(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Single User Retrieved");
      expect(res.body.data).toHaveProperty("_id", testUserId);
    });

    test("returns 404 for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get(`/api/admin/users/${testUserId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/admin/users", () => {
    test("creates a new user", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          username: "newadminuser",
          email: "newadminuser@example.com",
          password: "password123",
          confirmPassword: "password123",
          fullName: "New Admin User",
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "User Created");
    });

    test("returns 400 for missing fields", async () => {
      const res = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ email: "incomplete@example.com" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).post("/api/admin/users").send({});
      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/admin/users/:id", () => {
    test("updates a user", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ fullName: "Updated Target User" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "User Updated");
    });

    test("returns 401 without token", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${testUserId}`)
        .send({ fullName: "Unauthorized" });
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/users/:id", () => {
    test("deletes a user", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "User Deleted");
    });

    test("returns 404 for non-existent user", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .delete(`/api/admin/users/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).delete(`/api/admin/users/${testUserId}`);
      expect(res.status).toBe(401);
    });
  });
});
