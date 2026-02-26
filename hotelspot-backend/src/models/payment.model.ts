import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  pidx: string;
  transactionId: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  paymentMethod: "cash" | "card" | "online";
  khaltiResponse: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    pidx: { type: String, required: false },
    transactionId: { type: String, required: false },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "online",
    },
    khaltiResponse: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
);

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
