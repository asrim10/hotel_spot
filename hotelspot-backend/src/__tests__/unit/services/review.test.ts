import { ReviewService } from "../../../services/review.service";
import { ReviewRepository } from "../../../repositories/review.repositories";
import { ReviewModel } from "../../../models/review.model";
import { HotelModel } from "../../../models/hotel.model";
import { HttpError } from "../../../errors/http-error";

jest.mock("../../../models/review.model");
jest.mock("../../../models/hotel.model");

describe("ReviewService", () => {
  let service: ReviewService;

  const fakeReview = {
    _id: "review123",
    userId: "user123",
    hotelId: { toString: () => "64b1f6f1e4b0a1a2b3c4d5e6" },
    rating: 4,
    comment: "Great stay!",
  };

  const repo = {
    create: jest.spyOn(ReviewRepository.prototype, "create"),
    getById: jest.spyOn(ReviewRepository.prototype, "getById"),
    getByHotelId: jest.spyOn(ReviewRepository.prototype, "getByHotelId"),
    getByUserId: jest.spyOn(ReviewRepository.prototype, "getByUserId"),
    update: jest.spyOn(ReviewRepository.prototype, "update"),
    delete: jest.spyOn(ReviewRepository.prototype, "delete"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ReviewService();
    // Mock updateHotelRating internals by default
    (ReviewModel.aggregate as jest.Mock).mockResolvedValue([
      { avgRating: 4.0 },
    ]);
    (HotelModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
  });

  // 1. createReview: creates review and triggers rating update
  it("1. createReview returns new review and updates hotel rating", async () => {
    repo.create.mockResolvedValue(fakeReview as any);

    const result = await service.createReview({
      hotelId: "64b1f6f1e4b0a1a2b3c4d5e6",
      rating: 4,
      comment: "Great!",
    } as any);

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(ReviewModel.aggregate).toHaveBeenCalled();
    expect(HotelModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toEqual(fakeReview);
  });

  // 2. getReviewById: returns review when found
  it("2. getReviewById returns review when found", async () => {
    repo.getById.mockResolvedValue(fakeReview as any);

    const result = await service.getReviewById("review123");

    expect(result).toEqual(fakeReview);
    expect(repo.getById).toHaveBeenCalledWith("review123");
  });

  // 3. getReviewById: throws 404 when not found
  it("3. getReviewById throws 404 when review not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getReviewById("nonexistent")).rejects.toThrow(
      new HttpError(404, "Review not found"),
    );
  });

  // 4. getReviewsByHotelId: returns reviews for a hotel
  it("4. getReviewsByHotelId returns reviews for the given hotel", async () => {
    repo.getByHotelId.mockResolvedValue([fakeReview] as any);

    const result = await service.getReviewsByHotelId("hotel123");

    expect(result).toEqual([fakeReview]);
    expect(repo.getByHotelId).toHaveBeenCalledWith("hotel123");
  });

  // 5. getReviewsByUserId: returns reviews for a user
  it("5. getReviewsByUserId returns reviews for the given user", async () => {
    repo.getByUserId.mockResolvedValue([fakeReview] as any);

    const result = await service.getReviewsByUserId("user123");

    expect(result).toEqual([fakeReview]);
    expect(repo.getByUserId).toHaveBeenCalledWith("user123");
  });

  // 6. updateReview: throws 404 when review not found
  it("6. updateReview throws 404 when review not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(
      service.updateReview("nonexistent", { rating: 3 } as any),
    ).rejects.toThrow(new HttpError(404, "Review not found"));
  });

  // 7. updateReview: updates review and triggers rating update
  it("7. updateReview returns updated review and updates hotel rating", async () => {
    const updated = { ...fakeReview, rating: 3 };
    repo.getById.mockResolvedValue(fakeReview as any);
    repo.update.mockResolvedValue(updated as any);

    const result = await service.updateReview("review123", {
      rating: 3,
    } as any);

    expect(repo.update).toHaveBeenCalledWith("review123", { rating: 3 });
    expect(HotelModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  // 8. deleteReview: throws 404 when review not found
  it("8. deleteReview throws 404 when review not found", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.deleteReview("nonexistent")).rejects.toThrow(
      new HttpError(404, "Review not found"),
    );
  });

  // 9. deleteReview: deletes review and triggers rating update
  it("9. deleteReview deletes review and updates hotel rating", async () => {
    repo.getById.mockResolvedValue(fakeReview as any);
    repo.delete.mockResolvedValue(true as any);

    const result = await service.deleteReview("review123");

    expect(repo.delete).toHaveBeenCalledWith("review123");
    expect(HotelModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  // 10. updateHotelRating: sets rating to 0 when no reviews exist
  it("10. updateHotelRating sets hotel rating to 0 when no reviews exist", async () => {
    (ReviewModel.aggregate as jest.Mock).mockResolvedValue([]);

    await service.updateHotelRating("64b1f6f1e4b0a1a2b3c4d5e6");

    expect(HotelModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "64b1f6f1e4b0a1a2b3c4d5e6",
      { rating: 0 },
    );
  });
});
