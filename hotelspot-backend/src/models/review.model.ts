import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
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
  { timestamps: true },
);

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
