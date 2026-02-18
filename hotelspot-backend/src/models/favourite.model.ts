import mongoose, { Document, Schema } from "mongoose";
import { FavouriteType } from "../types/favourite.type";

const FavouriteSchema: Schema = new Schema<FavouriteType>(
  {
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

FavouriteSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

export interface IFavourite extends FavouriteType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const FavouriteModel = mongoose.model<IFavourite>(
  "Favourite",
  FavouriteSchema,
);
