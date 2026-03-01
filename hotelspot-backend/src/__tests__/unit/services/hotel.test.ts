import { HotelService } from "../../../services/hotel.service";
import { HotelRepository } from "../../../repositories/hotel.repositories";

// --- Mocks ---
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("HotelService", () => {
  let service: HotelService;

  const fakeHotel = {
    _id: "hotel123",
    hotelName: "Grand Hotel",
    location: "Paris",
    price: 200,
    rating: 4.5,
  };

  const repo = {
    getAllPaginated: jest.spyOn(HotelRepository.prototype, "getAllPaginated"),
    getById: jest.spyOn(HotelRepository.prototype, "getById"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HotelService();
  });

  // 1. getAllHotels: returns hotels and pagination
  it("1. getAllHotels returns hotels and correct pagination", async () => {
    repo.getAllPaginated.mockResolvedValue({
      hotels: [fakeHotel],
      total: 1,
    } as any);

    const result = await service.getAllHotels(1, 10);

    expect(result.hotels).toEqual([fakeHotel]);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
      itemsPerPage: 10,
    });
  });

  // 2. getAllHotels: calculates totalPages correctly
  it("2. getAllHotels calculates totalPages with ceiling division", async () => {
    repo.getAllPaginated.mockResolvedValue({ hotels: [], total: 25 } as any);

    const result = await service.getAllHotels(1, 10);

    expect(result.pagination.totalPages).toBe(3);
  });

  // 3. getAllHotels: passes page and size to repository
  it("3. getAllHotels passes page and size to repository", async () => {
    repo.getAllPaginated.mockResolvedValue({ hotels: [], total: 0 } as any);

    await service.getAllHotels(2, 5);

    expect(repo.getAllPaginated).toHaveBeenCalledWith(2, 5, undefined);
  });

  // 4. getAllHotels: passes search term to repository
  it("4. getAllHotels passes search term to repository", async () => {
    repo.getAllPaginated.mockResolvedValue({ hotels: [], total: 0 } as any);

    await service.getAllHotels(1, 10, "Paris");

    expect(repo.getAllPaginated).toHaveBeenCalledWith(1, 10, "Paris");
  });

  // 5. getAllHotels: returns empty array when no hotels found
  it("5. getAllHotels returns empty hotels array when none found", async () => {
    repo.getAllPaginated.mockResolvedValue({ hotels: [], total: 0 } as any);

    const result = await service.getAllHotels(1, 10);

    expect(result.hotels).toEqual([]);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });

  // 6. getAllHotels: returns correct currentPage in pagination
  it("6. getAllHotels reflects correct currentPage in pagination", async () => {
    repo.getAllPaginated.mockResolvedValue({ hotels: [], total: 50 } as any);

    const result = await service.getAllHotels(3, 10);

    expect(result.pagination.currentPage).toBe(3);
    expect(result.pagination.itemsPerPage).toBe(10);
  });

  // 7. getAllHotels: returns multiple hotels
  it("7. getAllHotels returns all hotels from repository", async () => {
    const hotels = [
      fakeHotel,
      { ...fakeHotel, _id: "hotel456", hotelName: "Budget Inn" },
    ];
    repo.getAllPaginated.mockResolvedValue({ hotels, total: 2 } as any);

    const result = await service.getAllHotels(1, 10);

    expect(result.hotels).toHaveLength(2);
    expect(result.hotels[1].hotelName).toBe("Budget Inn");
  });

  // 8. getHotelById: returns hotel when found
  it("8. getHotelById returns the hotel when found", async () => {
    repo.getById.mockResolvedValue(fakeHotel as any);

    const result = await service.getHotelById("hotel123");

    expect(result).toEqual(fakeHotel);
    expect(repo.getById).toHaveBeenCalledWith("hotel123");
  });

  // 9. getHotelById: returns null when hotel not found
  it("9. getHotelById returns null when hotel not found", async () => {
    repo.getById.mockResolvedValue(null);

    const result = await service.getHotelById("nonexistent");

    expect(result).toBeNull();
  });

  // 10. getHotelById: calls repository with correct id
  it("10. getHotelById calls repository with the provided id", async () => {
    repo.getById.mockResolvedValue(null);

    await service.getHotelById("abc-999");

    expect(repo.getById).toHaveBeenCalledWith("abc-999");
    expect(repo.getById).toHaveBeenCalledTimes(1);
  });
});
