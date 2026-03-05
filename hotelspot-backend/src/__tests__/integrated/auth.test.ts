import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

describe("Authentication Routes", () => {
  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    fullName: "Test Man",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: testUser.email }, { username: testUser.username }],
    });
  });

  afterAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: testUser.email }, { username: testUser.username }],
    });
    await UserModel.deleteMany({ email: "newemail@example.com" });
  });

  describe("POST /api/auth/register", () => {
    test("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User Created");
      expect(response.body).toHaveProperty("success", true);
    });

    test("should not register a duplicate email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message", "Email already in use");
      expect(response.body).toHaveProperty("success", false);
    });

    test("should not register a duplicate username with different email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: testUser.username,
        email: "newemail@example.com",
        password: "password123",
        confirmPassword: "password123",
        fullName: "Test Duplicate",
      });
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Username already in use",
      );
      expect(response.body).toHaveProperty("success", false);
    });

    test("should not register a user with missing fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email: "no_username@example.com" });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should not register a user with invalid email", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "invalidEmailUser",
        email: "invalidemail",
        password: "password123",
        confirmPassword: "password123",
        fullName: "Invalid Email",
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/email/i);
    });

    test("should not register a user when passwords do not match", async () => {
      const response = await request(app).post("/api/auth/register").send({
        username: "passwordMismatch",
        email: "passwordMismatch@example.com",
        password: "password123",
        confirmPassword: "password321",
        fullName: "Password Mismatch",
      });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/confirmPassword/i);
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("email", testUser.email);
    });

    test("should not login with incorrect password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid/i);
    });

    test("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });

    test("should not login with missing email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ password: testUser.password });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/email/i);
    });

    test("should not login with missing password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/password/i);
    });

    test("should not login with invalid data types", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: 12345, password: true });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/email/i);
    });
  });
});
