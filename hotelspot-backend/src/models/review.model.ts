import mongoose, { Document, Schema } from "mongoose";
import { ReviewType } from "../types/review.types";

const ReviewSchema: Schema = new Schema<ReviewType>(
  {
    userId: {
      type: String,
      required: true,
    },

    hotelId: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

export interface IReview extends ReviewType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
