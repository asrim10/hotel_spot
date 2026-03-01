import { FavouriteService } from "../../../services/favourite.service";
import { FavouriteRepository } from "../../../repositories/favourite.repositories";
import { HttpError } from "../../../errors/http-error";

describe("FavouriteService", () => {
  let service: FavouriteService;

  const fakeFavourite = {
    _id: "fav123",
    userId: "user123",
    hotelId: { toString: () => "hotel123" },
  };

  const repo = {
    getByUserId: jest.spyOn(FavouriteRepository.prototype, "getByUserId"),
    getById: jest.spyOn(FavouriteRepository.prototype, "getById"),
    add: jest.spyOn(FavouriteRepository.prototype, "add"),
    remove: jest.spyOn(FavouriteRepository.prototype, "remove"),
    getAll: jest.spyOn(FavouriteRepository.prototype, "getAll"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FavouriteService();
  });

  // 1. addFavourite: throws 400 if hotel already in favourites
  it("1. addFavourite throws 400 if hotel already in favourites", async () => {
    repo.getByUserId.mockResolvedValue([fakeFavourite] as any);

    await expect(
      service.addFavourite({ hotelId: "hotel123" } as any, "user123"),
    ).rejects.toThrow(new HttpError(400, "Hotel already in favourites"));
  });

  // 2. addFavourite: creates favourite with merged userId
  it("2. addFavourite creates favourite with merged userId", async () => {
    repo.getByUserId.mockResolvedValue([]);
    repo.add.mockResolvedValue(fakeFavourite as any);

    const result = await service.addFavourite(
      { hotelId: "hotel456" } as any,
      "user123",
    );

    expect(repo.add).toHaveBeenCalledWith({
      hotelId: "hotel456",
      userId: "user123",
    });
    expect(result).toEqual(fakeFavourite);
  });

  // 3. addFavourite: allows adding a different hotel for same user
  it("3. addFavourite succeeds when hotel is not yet in favourites", async () => {
    repo.getByUserId.mockResolvedValue([fakeFavourite] as any);
    repo.add.mockResolvedValue({
      ...fakeFavourite,
      hotelId: { toString: () => "hotel999" },
    } as any);

    const result = await service.addFavourite(
      { hotelId: "hotel999" } as any,
      "user123",
    );

    expect(repo.add).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // 4. removeFavourite: throws 404 when favourite not found
  it("4. removeFavourite throws 404 when favourite not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.removeFavourite("nonexistent")).rejects.toThrow(
      new HttpError(404, "Favourite not found"),
    );
  });

  // 5. removeFavourite: deletes and returns result when found
  it("5. removeFavourite deletes and returns result when found", async () => {
    repo.getById.mockResolvedValue(fakeFavourite as any);
    repo.remove.mockResolvedValue(true as any);

    const result = await service.removeFavourite("fav123");

    expect(repo.remove).toHaveBeenCalledWith("fav123");
    expect(result).toBe(true);
  });

  // 6. getFavouriteById: returns favourite when found
  it("6. getFavouriteById returns favourite when found", async () => {
    repo.getById.mockResolvedValue(fakeFavourite as any);

    const result = await service.getFavouriteById("fav123");

    expect(result).toEqual(fakeFavourite);
    expect(repo.getById).toHaveBeenCalledWith("fav123");
  });

  // 7. getFavouriteById: throws 404 when not found
  it("7. getFavouriteById throws 404 when favourite not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getFavouriteById("nonexistent")).rejects.toThrow(
      new HttpError(404, "Favourite not found"),
    );
  });

  // 8. getFavouritesByUserId: returns favourites for a user
  it("8. getFavouritesByUserId returns favourites for the given user", async () => {
    repo.getByUserId.mockResolvedValue([fakeFavourite] as any);

    const result = await service.getFavouritesByUserId("user123");

    expect(result).toEqual([fakeFavourite]);
    expect(repo.getByUserId).toHaveBeenCalledWith("user123");
  });

  // 9. getFavouritesByUserId: returns empty array when user has no favourites
  it("9. getFavouritesByUserId returns empty array when none exist", async () => {
    repo.getByUserId.mockResolvedValue([]);

    const result = await service.getFavouritesByUserId("user123");

    expect(result).toEqual([]);
  });

  // 10. getAllFavourites: returns all favourites
  it("10. getAllFavourites returns all favourites from repository", async () => {
    repo.getAll.mockResolvedValue([fakeFavourite] as any);

    const result = await service.getAllFavourites();

    expect(result).toEqual([fakeFavourite]);
    expect(repo.getAll).toHaveBeenCalledTimes(1);
  });
});
