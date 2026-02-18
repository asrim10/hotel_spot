import mongoose, { Document, Schema } from "mongoose";
import { BookingType } from "../types/booking.type";

const BookingSchema: Schema = new Schema<BookingType>(
  {
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },

    fullName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true },

    checkInDate: { type: String, required: true },
    checkOutDate: { type: String, required: true },

    totalPrice: { type: Number, required: true, min: 0 },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      required: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "checked_in", "checked_out"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export interface IBooking extends BookingType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
