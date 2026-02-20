import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { HttpError } from "../errors/http-error";
import { ReviewRepository } from "../repositories/review.repositories";

let reviewRepository = new ReviewRepository();

export class ReviewService {
  async createReview(data: CreateReviewDTO) {
    const newReview = await reviewRepository.create(data);
    return newReview;
  }

  async getReviewById(id: string) {
    const review = await reviewRepository.getById(id);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    return review;
  }

  async getReviewsByHotelId(hotelId: string) {
    const reviews = await reviewRepository.getByHotelId(hotelId);
    return reviews;
  }

  async getReviewsByUserId(userId: string) {
    const reviews = await reviewRepository.getByUserId(userId);
    return reviews;
  }

  async updateReview(id: string, updateData: UpdateReviewDTO) {
    const review = await reviewRepository.getById(id);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    const updatedReview = await reviewRepository.update(id, updateData);
    return updatedReview;
  }

  async deleteReview(id: string) {
    const review = await reviewRepository.getById(id);

    if (!review) {
      throw new HttpError(404, "Review not found");
    }

    const deleted = await reviewRepository.delete(id);
    return deleted;
  }
}
