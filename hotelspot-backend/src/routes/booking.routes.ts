import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const bookingController = new BookingController();

router.post("/", authorizedMiddleware, (req, res) =>
  bookingController.createBooking(req, res),
);

router.get("/me", authorizedMiddleware, (req, res) =>
  bookingController.getMyBookings(req, res),
);

router.get("/:id", authorizedMiddleware, (req, res) =>
  bookingController.getBookingById(req, res),
);

router.put("/:id", authorizedMiddleware, (req, res) =>
  bookingController.updateBooking(req, res),
);

router.delete("/:id", authorizedMiddleware, (req, res) =>
  bookingController.deleteBooking(req, res),
);

export default router;
