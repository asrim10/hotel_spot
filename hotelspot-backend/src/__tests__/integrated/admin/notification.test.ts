import request from "supertest";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { UserModel } from "../../../models/user.model";
import { NotificationModel } from "../../../models/notification.model";
import app from "../../../app";

describe("Admin Notification Routes", () => {
  let adminToken: string;
  let testNotificationId: string;
  let testUserId: string;

  const adminUser = {
    username: "adminnotif",
    email: "adminnotif@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: adminUser.email }, { username: adminUser.username }],
    });

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const admin = await UserModel.create({
      username: adminUser.username,
      email: adminUser.email,
      password: hashedPassword,
      fullName: "Admin Notif",
      role: "admin",
    });
    testUserId = admin._id.toString();

    const loginRes = await request(app).post("/api/auth/login").send({
      email: adminUser.email,
      password: adminUser.password,
    });

    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }
    adminToken = loginRes.body.token;

    const notification = await NotificationModel.create({
      userId: testUserId,
      title: "Admin Test Notification",
      message: "This is a test notification for admin",
      type: "general",
      isRead: false,
    });
    testNotificationId = notification._id.toString();
  });

  afterAll(async () => {
    await NotificationModel.deleteMany({ userId: testUserId });
    await UserModel.deleteMany({ email: adminUser.email });
  });

  describe("GET /api/admin/notify", () => {
    test("returns all notifications", async () => {
      const res = await request(app)
        .get("/api/admin/notify")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "All notifications retrieved");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/admin/notify");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/admin/notify/:id", () => {
    test("returns a notification by id", async () => {
      const res = await request(app)
        .get(`/api/admin/notify/${testNotificationId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Notification retrieved");
      expect(res.body.data).toHaveProperty("_id", testNotificationId);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .get("/api/admin/notify/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid notification ID");
    });

    test("returns 404 for non-existent notification", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/admin/notify/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get(
        `/api/admin/notify/${testNotificationId}`,
      );
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/admin/notify/user/:userId", () => {
    test("returns notifications by user id", async () => {
      const res = await request(app)
        .get(`/api/admin/notify/user/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "User notifications retrieved",
      );
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get(
        `/api/admin/notify/user/${testUserId}`,
      );
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/notify/:id", () => {
    test("deletes a notification", async () => {
      const res = await request(app)
        .delete(`/api/admin/notify/${testNotificationId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Notification deleted");
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .delete("/api/admin/notify/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid notification ID");
    });

    test("returns 404 for already-deleted notification", async () => {
      const res = await request(app)
        .delete(`/api/admin/notify/${testNotificationId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 401 without token", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).delete(`/api/admin/notify/${fakeId}`);
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/notify/user/:userId", () => {
    test("deletes all notifications for a user", async () => {
      await NotificationModel.create({
        userId: testUserId,
        title: "To be deleted",
        message: "This will be deleted",
        type: "general",
        isRead: false,
      });

      const res = await request(app)
        .delete(`/api/admin/notify/user/${testUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "All notifications for user deleted",
      );
    });

    test("returns 401 without token", async () => {
      const res = await request(app).delete(
        `/api/admin/notify/user/${testUserId}`,
      );
      expect(res.status).toBe(401);
    });
  });
});
