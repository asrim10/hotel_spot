import { QueryFilter } from "mongoose";
import { ReviewModel, IReview } from "../models/review.model";

export interface IReviewRepository {
  create(reviewData: any): Promise<IReview>;
  getById(reviewId: string): Promise<IReview | null>;
  update(reviewId: string, reviewData: any): Promise<IReview | null>;
  delete(reviewId: string): Promise<boolean>;
  getAll(): Promise<IReview[]>;
  getAllPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ reviews: IReview[]; total: number }>;
  getByHotelId(hotelId: string): Promise<IReview[]>;
  getByUserId(userId: string): Promise<IReview[]>;
}

export class ReviewRepository implements IReviewRepository {
  async create(reviewData: any): Promise<IReview> {
    const review = new ReviewModel(reviewData);
    return await review.save();
  }

  async getAll(): Promise<IReview[]> {
    return await ReviewModel.find()
      .populate("userId")
      .populate("hotelId")
      .sort({ createdAt: -1 });
  }

  async getAllPaginated(page: number, size: number, search?: string) {
    const query: QueryFilter<IReview> = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    const total = await ReviewModel.countDocuments(query);
    const reviews = await ReviewModel.find(query)
      .populate("userId")
      .populate("hotelId")
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 });

    return { reviews, total };
  }

  async getById(reviewId: string): Promise<IReview | null> {
    return await ReviewModel.findById(reviewId)
      .populate("userId")
      .populate("hotelId");
  }

  async getByHotelId(hotelId: string): Promise<IReview[]> {
    return await ReviewModel.find({ hotelId })
      .populate("userId")
      .sort({ createdAt: -1 });
  }

  async getByUserId(userId: string): Promise<IReview[]> {
    return await ReviewModel.find({ userId })
      .populate("hotelId")
      .sort({ createdAt: -1 });
  }

  async update(reviewId: string, reviewData: any): Promise<IReview | null> {
    return await ReviewModel.findByIdAndUpdate(reviewId, reviewData, {
      new: true,
    });
  }

  async delete(reviewId: string): Promise<boolean> {
    const deleted = await ReviewModel.findByIdAndDelete(reviewId);
    return deleted !== null;
  }
}
