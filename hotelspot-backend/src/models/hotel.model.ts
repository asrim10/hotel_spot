import mongoose, { Document, Schema } from "mongoose";
import { HotelType } from "../types/hotel.type";

const HotelSchema: Schema = new Schema<HotelType>(
  {
    hotelName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    rating: { type: Number, min: 0, max: 5, required: false },
    description: { type: String, required: false },
    price: { type: Number, required: true, min: 0 },
    availableRooms: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export interface IHotel extends HotelType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const HotelModel = mongoose.model<IHotel>("Hotel", HotelSchema);
