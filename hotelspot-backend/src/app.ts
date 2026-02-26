import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { HttpError } from "./errors/http-error";
import path from "path";

import authRoutes from "./routes/auth.routes";
import hotelRoutes from "./routes/hotel.routes";
import bookingRoutes from "./routes/booking.routes";
import favouriteRoutes from "./routes/favourite.routes";
import reviewRoutes from "./routes/review.routes";
import paymentRoutes from "./routes/payment.routes";
import notificationRoutes from "./routes/notification.routes";

import adminUserRoutes from "./routes/admin/user.routes";
import adminHotelRoutes from "./routes/admin/hotel.routes";
import adminBookingRoutes from "./routes/admin/booking.routes";
import adminReviewRoutes from "./routes/admin/review.routes";
import adminNotificationRoutes from "./routes/admin/notification.routes";

dotenv.config();

console.log(process.env.PORT);

const app: Application = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3005",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/fav", favouriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notify", notificationRoutes);

app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/hotels", adminHotelRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/notify", adminNotificationRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to API World!");
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err instanceof HttpError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  return res
    .status(500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;
