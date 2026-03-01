import { FavouriteModel } from "../../../models/favourite.model";
import { UserModel } from "../../../models/user.model";
import { HotelModel } from "../../../models/hotel.model";
import mongoose from "mongoose";
import { FavouriteRepository } from "../../../repositories/favourite.repositories";

describe("Favourite Repository Unit Tests", () => {
  let favouriteRepository: FavouriteRepository;
  let testUserId: string;
  let testHotelId: string;
  let testHotelId2: string;

  beforeAll(async () => {
    favouriteRepository = new FavouriteRepository();

    const user = await UserModel.create({
      username: "favouriteuser",
      email: "favouriteuser@example.com",
      password: "Password123!",
      fullName: "Favourite User",
      role: "user" as const,
    });
    testUserId = user._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Favourite Test Hotel",
      address: "123 Favourite Street",
      city: "Favourite City",
      country: "Favourite Country",
      rating: 4.5,
      description: "A test hotel for favourites",
      price: 200,
      availableRooms: 5,
    });
    testHotelId = hotel._id.toString();

    const hotel2 = await HotelModel.create({
      hotelName: "Favourite Test Hotel 2",
      address: "456 Favourite Street",
      city: "Favourite City",
      country: "Favourite Country",
      rating: 4.0,
      description: "A second test hotel for favourites",
      price: 150,
      availableRooms: 3,
    });
    testHotelId2 = hotel2._id.toString();
  });

  afterEach(async () => {
    await FavouriteModel.deleteMany({ userId: testUserId });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "favouriteuser@example.com" });
    await HotelModel.deleteMany({ hotelName: /Favourite Test Hotel/ });
    await mongoose.connection.close();
  });

  const getFavouriteData = (overrides = {}) => ({
    userId: testUserId,
    hotelId: testHotelId,
    ...overrides,
  });

  // 1. Add Favourite
  test("should add a new favourite", async () => {
    const newFav = await favouriteRepository.add(getFavouriteData());
    expect(newFav).toBeDefined();
    expect(newFav.userId.toString()).toBe(testUserId);
    expect(newFav.hotelId.toString()).toBe(testHotelId);
  });

  // 2. Get Favourite By ID
  test("should get a favourite by ID", async () => {
    const newFav = await favouriteRepository.add(getFavouriteData());
    const found = await favouriteRepository.getById(newFav._id.toString());
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(newFav._id.toString());
  });

  // 3. Get Favourite By ID - Not Found
  test("should return null when getting a favourite by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await favouriteRepository.getById(fakeId);
    expect(found).toBeNull();
  });

  // 4. Get Favourites By User ID
  test("should get all favourites by user ID", async () => {
    await favouriteRepository.add(getFavouriteData());
    const favourites = await favouriteRepository.getByUserId(testUserId);
    expect(Array.isArray(favourites)).toBe(true);
    expect(favourites.length).toBeGreaterThan(0);
  });

  // 5. Get Favourites By User ID - Multiple
  test("should get multiple favourites for a user", async () => {
    await favouriteRepository.add(getFavouriteData());
    await favouriteRepository.add(getFavouriteData({ hotelId: testHotelId2 }));
    const favourites = await favouriteRepository.getByUserId(testUserId);
    expect(favourites.length).toBe(2);
  });

  // 6. Get Favourites By User ID - Empty
  test("should return empty array when user has no favourites", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const favourites = await favouriteRepository.getByUserId(fakeUserId);
    expect(Array.isArray(favourites)).toBe(true);
    expect(favourites.length).toBe(0);
  });

  // 7. Get All Favourites
  test("should get all favourites", async () => {
    await favouriteRepository.add(getFavouriteData());
    const favourites = await favouriteRepository.getAll();
    expect(Array.isArray(favourites)).toBe(true);
    expect(favourites.length).toBeGreaterThan(0);
  });

  // 8. Remove Favourite
  test("should remove a favourite by ID", async () => {
    const newFav = await favouriteRepository.add(getFavouriteData());
    const result = await favouriteRepository.remove(newFav._id.toString());
    expect(result).toBe(true);

    // Verify favourite is deleted
    const deleted = await favouriteRepository.getById(newFav._id.toString());
    expect(deleted).toBeNull();
  });

  // 9. Remove Favourite - Not Found
  test("should return false when removing a non-existent favourite", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const result = await favouriteRepository.remove(fakeId);
    expect(result).toBe(false);
  });

  // 10. Get By User ID returns correct hotelId
  test("should return favourites with correct hotelId", async () => {
    await favouriteRepository.add(getFavouriteData());
    const favourites = await favouriteRepository.getByUserId(testUserId);
    expect(favourites.length).toBeGreaterThan(0);
    expect(favourites[0].hotelId.toString()).toBe(testHotelId);
  });
});
