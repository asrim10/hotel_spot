import { ReviewModel } from "../../../models/review.model";
import { UserModel } from "../../../models/user.model";
import { HotelModel } from "../../../models/hotel.model";
import mongoose from "mongoose";
import { ReviewRepository } from "../../../repositories/review.repositories";

describe("Review Repository Unit Tests", () => {
  let reviewRepository: ReviewRepository;
  let testUserId: string;
  let testHotelId: string;

  beforeAll(async () => {
    reviewRepository = new ReviewRepository();

    const user = await UserModel.create({
      username: "reviewuser",
      email: "reviewuser@example.com",
      password: "Password123!",
      fullName: "Review User",
      role: "user" as const,
    });
    testUserId = user._id.toString();

    const hotel = await HotelModel.create({
      hotelName: "Review Test Hotel",
      address: "123 Review Street",
      city: "Review City",
      country: "Review Country",
      rating: 4.0,
      description: "A test hotel for reviews",
      price: 200,
      availableRooms: 5,
    });
    testHotelId = hotel._id.toString();
  });

  afterEach(async () => {
    await ReviewModel.deleteMany({ userId: testUserId });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: "reviewuser@example.com" });
    await HotelModel.deleteMany({ hotelName: "Review Test Hotel" });
    await mongoose.connection.close();
  });

  const getReviewData = (overrides = {}) => ({
    userId: testUserId,
    hotelId: testHotelId,
    fullName: "Review User",
    email: "reviewuser@example.com",
    rating: 4,
    comment: "Great hotel, very comfortable stay!",
    ...overrides,
  });

  // 1. Create Review
  test("should create a new review", async () => {
    const newReview = await reviewRepository.create(getReviewData());
    expect(newReview).toBeDefined();
    expect(newReview.comment).toBe("Great hotel, very comfortable stay!");
    expect(newReview.rating).toBe(4);
  });

  // 2. Get Review By ID
  test("should get a review by ID", async () => {
    const newReview = await reviewRepository.create(getReviewData());
    const found = await reviewRepository.getById(newReview._id.toString());
    expect(found).toBeDefined();
    expect(found?._id.toString()).toBe(newReview._id.toString());
  });

  // 3. Get Review By ID - Not Found
  test("should return null when getting a review by non-existent ID", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const found = await reviewRepository.getById(fakeId);
    expect(found).toBeNull();
  });

  // 4. Get All Reviews
  test("should get all reviews", async () => {
    await reviewRepository.create(getReviewData());
    const reviews = await reviewRepository.getAll();
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
  });

  // 5. Get All Paginated - No Search
  test("should get paginated reviews without search", async () => {
    await reviewRepository.create(getReviewData());
    const result = await reviewRepository.getAllPaginated(1, 10);
    expect(result).toBeDefined();
    expect(Array.isArray(result.reviews)).toBe(true);
    expect(result.total).toBeGreaterThan(0);
  });

  // 6. Get All Paginated - With Search
  test("should get paginated reviews with search query", async () => {
    await reviewRepository.create(getReviewData());
    const result = await reviewRepository.getAllPaginated(1, 10, "Great hotel");
    expect(result).toBeDefined();
    expect(Array.isArray(result.reviews)).toBe(true);
    expect(result.reviews.length).toBeGreaterThan(0);
  });

  // 7. Get All Paginated - No Match
  test("should return empty array when search query has no match", async () => {
    await reviewRepository.create(getReviewData());
    const result = await reviewRepository.getAllPaginated(
      1,
      10,
      "nonexistentreview999",
    );
    expect(result.reviews.length).toBe(0);
    expect(result.total).toBe(0);
  });

  // 8. Get Reviews By Hotel ID
  test("should get all reviews by hotel ID", async () => {
    await reviewRepository.create(getReviewData());
    const reviews = await reviewRepository.getByHotelId(testHotelId);
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0].hotelId.toString()).toBe(testHotelId);
  });

  // 9. Get Reviews By User ID
  test("should get all reviews by user ID", async () => {
    await reviewRepository.create(getReviewData());
    const reviews = await reviewRepository.getByUserId(testUserId);
    expect(Array.isArray(reviews)).toBe(true);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0].userId.toString()).toBe(testUserId);
  });

  // 10. Update Review
  test("should update a review", async () => {
    const newReview = await reviewRepository.create(getReviewData());
    const updated = await reviewRepository.update(newReview._id.toString(), {
      rating: 5,
      comment: "Amazing experience!",
    });
    expect(updated).toBeDefined();
    expect(updated?.rating).toBe(5);
    expect(updated?.comment).toBe("Amazing experience!");
  });

  // 11. Delete Review
  test("should delete a review by ID", async () => {
    const newReview = await reviewRepository.create(getReviewData());
    const result = await reviewRepository.delete(newReview._id.toString());
    expect(result).toBe(true);

    // Verify review is deleted
    const deleted = await reviewRepository.getById(newReview._id.toString());
    expect(deleted).toBeNull();
  });
});
