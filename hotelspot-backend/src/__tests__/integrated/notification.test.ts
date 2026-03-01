import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { NotificationModel } from "../../models/notification.model";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

describe("Notification Routes", () => {
  let authToken: string;
  let testNotificationId: string;
  let testUserId: string;

  const userData = {
    username: "notifuser",
    email: "notifuser@example.com",
    password: "password123",
    fullName: "Notif User",
  };

  beforeAll(async () => {
    // Clean up before tests
    await UserModel.deleteMany({ email: userData.email });

    // Create user
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const testUser = await UserModel.create({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      role: "user",
    });
    testUserId = testUser._id.toString();

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;

    // Seed a notification for the test user
    const notification = await NotificationModel.create({
      userId: testUserId,
      title: "Welcome",
      message: "Welcome to the platform!",
      type: "general",
      isRead: false,
    });
    testNotificationId = notification._id.toString();
  });

  afterAll(async () => {
    await NotificationModel.deleteMany({ userId: testUserId });
    await UserModel.deleteMany({ email: userData.email });
  });

  // GET /api/notify
  describe("GET /api/notify", () => {
    test("returns notifications for the logged-in user", async () => {
      const res = await request(app)
        .get("/api/notify")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Notifications retrieved");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/notify");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // GET /api/notify/unread-count
  describe("GET /api/notify/unread-count", () => {
    test("returns unread notification count for the logged-in user", async () => {
      const res = await request(app)
        .get("/api/notify/unread-count")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Unread count retrieved");
      expect(typeof res.body.data).toBe("number");
      expect(res.body.data).toBeGreaterThanOrEqual(1);
    });

    test("returns 401 without token", async () => {
      const res = await request(app).get("/api/notify/unread-count");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });

  // PATCH /api/notify/:id/read
  describe("PATCH /api/notify/:id/read", () => {
    test("marks a notification as read", async () => {
      expect(testNotificationId).toBeDefined();

      const res = await request(app)
        .patch(`/api/notify/${testNotificationId}/read`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Notification marked as read");
      expect(res.body.data).toHaveProperty("_id", testNotificationId);
    });

    test("returns 400 for invalid notification id format", async () => {
      const res = await request(app)
        .patch("/api/notify/invalid-id/read")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid notification ID");
    });
  });

  // PATCH /api/notify/mark-all-read
  describe("PATCH /api/notify/mark-all-read", () => {
    test("marks all notifications as read for the logged-in user", async () => {
      const res = await request(app)
        .patch("/api/notify/mark-all-read")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty(
        "message",
        "All notifications marked as read",
      );
    });

    test("returns 401 without token", async () => {
      const res = await request(app).patch("/api/notify/mark-all-read");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });

    test("unread count is 0 after marking all as read", async () => {
      const res = await request(app)
        .get("/api/notify/unread-count")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBe(0);
    });
  });

  // DELETE /api/notify/:id
  describe("DELETE /api/notify/:id", () => {
    test("deletes a notification", async () => {
      expect(testNotificationId).toBeDefined();

      const res = await request(app)
        .delete(`/api/notify/${testNotificationId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body).toHaveProperty("message", "Notification deleted");
    });

    test("returns 404 for already-deleted id", async () => {
      const res = await request(app)
        .delete(`/api/notify/${testNotificationId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("success", false);
    });

    test("returns 400 for invalid id format", async () => {
      const res = await request(app)
        .delete("/api/notify/bad-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("success", false);
      expect(res.body).toHaveProperty("message", "Invalid notification ID");
    });

    test("returns 401 without token", async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).delete(`/api/notify/${fakeId}`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("success", false);
    });
  });
});
