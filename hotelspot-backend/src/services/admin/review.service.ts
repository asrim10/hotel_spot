import { CreateReviewDTO, UpdateReviewDTO } from "../../dtos/review.dto";
import { HttpError } from "../../errors/http-error";
import { ReviewRepository } from "../../repositories/review.repositories";

let reviewRepository = new ReviewRepository();

export class AdminReviewService {
  async getAllReviews(page: number = 1, size: number = 10, search?: string) {
    if (page < 1)
      throw new HttpError(400, "Page number must be greater than 0");
    if (size < 1 || size > 100)
      throw new HttpError(400, "Size must be between 1 and 100");

    const { reviews, total } = await reviewRepository.getAllPaginated(
      page,
      size,
      search,
    );

    return {
      reviews,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  async getReviewById(id: string) {
    const review = await reviewRepository.getById(id);
    if (!review) throw new HttpError(404, "Review not found");
    return review;
  }

  async getReviewsByUserId(userId: string) {
    return await reviewRepository.getByUserId(userId);
  }

  async getReviewsByHotelId(hotelId: string) {
    return await reviewRepository.getByHotelId(hotelId);
  }

  async updateReview(id: string, updateData: UpdateReviewDTO) {
    const review = await reviewRepository.getById(id);
    if (!review) throw new HttpError(404, "Review not found");

    const updatedReview = await reviewRepository.update(id, updateData);
    return updatedReview;
  }

  async deleteReview(id: string) {
    const review = await reviewRepository.getById(id);
    if (!review) throw new HttpError(404, "Review not found");

    const deleted = await reviewRepository.delete(id);
    return deleted;
  }

  async getReviewStats() {
    const allReviews = await reviewRepository.getAll();

    return {
      totalReviews: allReviews.length,
      averageRating:
        allReviews.reduce((sum, r) => sum + r.rating, 0) /
        (allReviews.length || 1),
      reviewsByRating: {
        1: allReviews.filter((r) => r.rating === 1).length,
        2: allReviews.filter((r) => r.rating === 2).length,
        3: allReviews.filter((r) => r.rating === 3).length,
        4: allReviews.filter((r) => r.rating === 4).length,
        5: allReviews.filter((r) => r.rating === 5).length,
      },
    };
  }
}
