import request from "supertest"; // mock HTTP requests
import app from "../../app"; // import the Express app
import { UserModel } from "../../models/user.model";
describe("Authentication Routes", () => {
  // test group/suite name
  // function containing related tests
  const testUser = {
    // make this object as per your User schema
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    fullName: "Test Man",
  };
  beforeAll(async () => {
    // Clean up the test user if it already exists
    await UserModel.deleteMany({ email: testUser.email });
  });
  afterAll(async () => {
    // Clean up the test user after tests
    await UserModel.deleteMany({ email: testUser.email });
  });

  describe("POST /api/auth/register", () => {
    // test group/suite name (nested)
    // function containing related tests
    test(// individual test case
    "should register a new user", async () => {
      // test case name
      // test case function
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User Created");
      expect(response.body).toHaveProperty("success", true);
    });

    test(// individual test case
    "should not register a new user", async () => {
      // test case name
      // test case function
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message", "Email already in use");
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
