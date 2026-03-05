import request from "supertest";
import app from "../../app";
import { HotelModel } from "../../models/hotel.model";
import { UserModel } from "../../models/user.model";
import bcrypt from "bcryptjs";

describe("Hotel Routes", () => {
  let authToken: string;
  let testHotelId: string;

  const testAdmin = {
    username: "adminhotel",
    email: "adminhotel@example.com",
    password: "password123",
    confirmPassword: "password123",
    fullName: "Admin Hotel",
  };

  const testHotel = {
    hotelName: "Test Hotel",
    address: "123 Test Street",
    city: "Test City",
    country: "Test Country",
    rating: 4.5,
    description: "A beautiful test hotel",
    price: 150,
    availableRooms: 10,
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      $or: [{ email: testAdmin.email }, { username: testAdmin.username }],
    });
    await HotelModel.deleteMany({
      hotelName: { $in: [testHotel.hotelName, "Updated Test Hotel"] },
    });

    const hashedPassword = await bcrypt.hash(testAdmin.password, 10);

    await UserModel.create({
      username: testAdmin.username,
      email: testAdmin.email,
      password: hashedPassword,
      fullName: testAdmin.fullName,
      role: "admin",
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testAdmin.email,
      password: testAdmin.password,
    });

    if (loginResponse.status !== 200) {
      throw new Error(
        `beforeAll login failed with status ${loginResponse.status}: ${JSON.stringify(loginResponse.body)}`,
      );
    }

    authToken = loginResponse.body.token;

    if (!authToken) {
      throw new Error(
        "Login succeeded but token was missing from response body",
      );
    }
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: testAdmin.email });
    await HotelModel.deleteMany({
      hotelName: { $in: [testHotel.hotelName, "Updated Test Hotel"] },
    });
  });

  describe("POST /api/admin/hotels", () => {
    test("should create a new hotel without image", async () => {
      const response = await request(app)
        .post("/api/admin/hotels")
        .set("Authorization", `Bearer ${authToken}`)
        .field("hotelName", testHotel.hotelName)
        .field("address", testHotel.address)
        .field("city", testHotel.city)
        .field("country", testHotel.country)
        .field("rating", testHotel.rating.toString())
        .field("description", testHotel.description)
        .field("price", testHotel.price.toString())
        .field("availableRooms", testHotel.availableRooms.toString());

      console.log("Create Response:", response.status, response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Hotel Created");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data).toHaveProperty(
        "hotelName",
        testHotel.hotelName,
      );

      testHotelId = response.body.data._id;
      expect(testHotelId).toBeDefined();
    });

    test("should not create hotel without authentication", async () => {
      const response = await request(app)
        .post("/api/admin/hotels")
        .field("hotelName", "Unauthorized Hotel")
        .field("address", "123 Unauth Street")
        .field("city", "Unauth City")
        .field("country", "Unauth Country")
        .field("price", "100")
        .field("availableRooms", "5");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should not create hotel with invalid data", async () => {
      const response = await request(app)
        .post("/api/admin/hotels")
        .set("Authorization", `Bearer ${authToken}`)
        .field("hotelName", "A") // too short
        .field("address", "123")
        .field("city", "A")
        .field("country", "A")
        .field("price", "-10") // negative price
        .field("availableRooms", "5");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/admin/hotels", () => {
    test("should get all hotels", async () => {
      const response = await request(app)
        .get("/api/admin/hotels")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("should search hotels by name", async () => {
      const response = await request(app)
        .get(`/api/admin/hotels?search=${testHotel.hotelName}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("should not get hotels without authentication", async () => {
      const response = await request(app).get("/api/admin/hotels");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("GET /api/admin/hotels/:id", () => {
    test("should get a single hotel by ID", async () => {
      if (!testHotelId) {
        throw new Error(
          "testHotelId is not set — 'should create a new hotel' must pass first",
        );
      }

      const response = await request(app)
        .get(`/api/admin/hotels/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`);

      console.log("Get Single Response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("_id", testHotelId);
      expect(response.body.data).toHaveProperty(
        "hotelName",
        testHotel.hotelName,
      );
    });

    test("should return 404 for non-existent hotel", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .get(`/api/admin/hotels/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should return 400 for invalid hotel ID", async () => {
      const response = await request(app)
        .get("/api/admin/hotels/invalid-id")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("PUT /api/admin/hotels/:id", () => {
    test("should update a hotel", async () => {
      if (!testHotelId) {
        throw new Error(
          "testHotelId is not set — 'should create a new hotel' must pass first",
        );
      }

      const updatedData = {
        hotelName: "Updated Test Hotel",
        price: 200,
        availableRooms: 20,
      };

      const response = await request(app)
        .put(`/api/admin/hotels/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("hotelName", updatedData.hotelName)
        .field("address", testHotel.address)
        .field("city", testHotel.city)
        .field("country", testHotel.country)
        .field("price", updatedData.price.toString())
        .field("availableRooms", updatedData.availableRooms.toString());

      console.log("Update Response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty(
        "hotelName",
        updatedData.hotelName,
      );
      expect(response.body.data).toHaveProperty("price", updatedData.price);
    });

    test("should not update hotel without authentication", async () => {
      const response = await request(app)
        .put(`/api/admin/hotels/${testHotelId}`)
        .field("hotelName", "Unauthorized Update");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should not update with invalid data", async () => {
      const response = await request(app)
        .put(`/api/admin/hotels/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .field("price", "-50");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("DELETE /api/admin/hotels/:id", () => {
    test("should delete a hotel", async () => {
      if (!testHotelId) {
        throw new Error(
          "testHotelId is not set — 'should create a new hotel' must pass first",
        );
      }

      const response = await request(app)
        .delete(`/api/admin/hotels/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`);

      console.log("Delete Response:", response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);

      const getResponse = await request(app)
        .get(`/api/admin/hotels/${testHotelId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(getResponse.status).toBe(404);
    });

    test("should not delete non-existent hotel", async () => {
      const fakeId = "507f1f77bcf86cd799439011";

      const response = await request(app)
        .delete(`/api/admin/hotels/${fakeId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("success", false);
    });

    test("should not delete hotel without authentication", async () => {
      const response = await request(app).delete(
        `/api/admin/hotels/${testHotelId}`,
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("success", false);
    });
  });
});
