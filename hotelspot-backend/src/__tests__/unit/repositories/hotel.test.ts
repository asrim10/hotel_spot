import { HotelModel } from "../../../models/hotel.model";
import mongoose from "mongoose";
import { HotelRepository } from "../../../repositories/hotel.repositories";

describe("Hotel Repository Unit Tests", () => {
  let hotelRepository: HotelRepository;

  const hotelData = {
    hotelName: "Test Hotel",
    address: "123 Test Street",
    city: "Test City",
    country: "Test Country",
    rating: 4.5,
    description: "A beautiful test hotel",
    price: 150,
    availableRooms: 10,
  };

  beforeAll(() => {
    hotelRepository = new HotelRepository();
  });

  afterEach(async () => {
    await HotelModel.deleteMany({ hotelName: hotelData.hotelName });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Create Hotel
  test("should create a new hotel", async () => {
    const newHotel = await hotelRepository.create(hotelData);
    expect(newHotel).toBeDefined();
    expect(newHotel.hotelName).toBe(hotelData.hotelName);
    expect(newHotel.city).toBe(hotelData.city);
    expect(newHotel.price).toBe(hotelData.price);
  });

  // 2. Get Hotel By ID
  test("should get a hotel by ID", async () => {
    const newHotel = await hotelRepository.create(hotelData);
    const found = await hotelRepository.getById(newHotel._id.toString());
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(newHotel._id.toString());
    expect(found?.hotelName).toBe(hotelData.hotelName);
  });

  // 3. Get Hotel By ID - Not Found
  test("should return null when getting a hotel by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await hotelRepository.getById(fakeId);
    expect(found).toBeNull();
  });

  // 4. Get All Hotels
  test("should get all hotels", async () => {
    await hotelRepository.create(hotelData);
    const hotels = await hotelRepository.getAll();
    expect(Array.isArray(hotels)).toBe(true);
    expect(hotels.length).toBeGreaterThan(0);
  });

  // 5. Get All Paginated - No Search
  test("should get paginated hotels without search", async () => {
    await hotelRepository.create(hotelData);
    const result = await hotelRepository.getAllPaginated(1, 10);
    expect(result).toBeDefined();
    expect(Array.isArray(result.hotels)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  // 6. Get All Paginated - With Search
  test("should get paginated hotels with search query", async () => {
    await hotelRepository.create(hotelData);
    const result = await hotelRepository.getAllPaginated(1, 10, "Test Hotel");
    expect(result).toBeDefined();
    expect(Array.isArray(result.hotels)).toBe(true);
    expect(result.hotels.length).toBeGreaterThan(0);
    expect(result.hotels[0].hotelName).toMatch(/test hotel/i);
  });

  // 7. Get All Paginated - No Match
  test("should return empty array when search query has no match", async () => {
    await hotelRepository.create(hotelData);
    const result = await hotelRepository.getAllPaginated(
      1,
      10,
      "nonexistenthotel999",
    );
    expect(result.hotels.length).toBe(0);
    expect(result.total).toBe(0);
  });

  // 8. Update Hotel
  test("should update a hotel", async () => {
    const newHotel = await hotelRepository.create(hotelData);
    const updated = await hotelRepository.update(newHotel._id.toString(), {
      price: 300,
      availableRooms: 20,
    });
    expect(updated).toBeDefined();
    expect(updated?.price).toBe(300);
    expect(updated?.availableRooms).toBe(20);
  });

  // 9. Update Hotel - Not Found
  test("should return null when updating a non-existent hotel", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const updated = await hotelRepository.update(fakeId, { price: 300 });
    expect(updated).toBeNull();
  });

  // 10. Delete Hotel
  test("should delete a hotel by ID", async () => {
    const newHotel = await hotelRepository.create(hotelData);
    const result = await hotelRepository.delete(newHotel._id.toString());
    expect(result).toBe(true);

    // Verify hotel is deleted
    const deleted = await hotelRepository.getById(newHotel._id.toString());
    expect(deleted).toBeNull();
  });
});
