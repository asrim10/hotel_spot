import { Router } from "express";
import { AdminBookingController } from "../../controllers/admin/booking.controller";
import {
  adminMiddleware,
  authorizedMiddleware,
} from "../../middlewares/authorized.middleware";

const router = Router();
const adminBookingController = new AdminBookingController();

router.use(authorizedMiddleware);
router.use(adminMiddleware);

//  MAIN CRUD OPERATIONS
router.get(
  "/",
  adminBookingController.getAllBookings.bind(adminBookingController),
);

router.get(
  "/:id",
  adminBookingController.getBookingById.bind(adminBookingController),
);
router.post(
  "/",
  adminBookingController.createBooking.bind(adminBookingController),
);
router.patch(
  "/:id",
  adminBookingController.updateBooking.bind(adminBookingController),
);
router.delete(
  "/:id",
  adminBookingController.deleteBooking.bind(adminBookingController),
);

//STATUS MANAGEMENT
router.patch(
  "/:id/status",
  adminBookingController.updateBookingStatus.bind(adminBookingController),
);
router.patch(
  "/:id/payment-status",
  adminBookingController.updatePaymentStatus.bind(adminBookingController),
);
router.post(
  "/:id/confirm",
  adminBookingController.confirmBooking.bind(adminBookingController),
);
router.post(
  "/:id/cancel",
  adminBookingController.cancelBooking.bind(adminBookingController),
);
router.post(
  "/:id/check-in",
  adminBookingController.checkIn.bind(adminBookingController),
);
router.post(
  "/:id/check-out",
  adminBookingController.checkOut.bind(adminBookingController),
);

//QUERIES AND FILTERS
router.get(
  "/analytics/stats",
  adminBookingController.getBookingStats.bind(adminBookingController),
);
router.get(
  "/user/:userId",
  adminBookingController.getBookingsByUserId.bind(adminBookingController),
);
router.get(
  "/status/:status",
  adminBookingController.getBookingsByStatus.bind(adminBookingController),
);
router.get(
  "/payment-status/:paymentStatus",
  adminBookingController.getBookingsByPaymentStatus.bind(
    adminBookingController,
  ),
);
router.get(
  "/filter/date-range",
  adminBookingController.getBookingsByDateRange.bind(adminBookingController),
);
router.get(
  "/upcoming/check-ins",
  adminBookingController.getUpcomingCheckIns.bind(adminBookingController),
);
router.get(
  "/upcoming/check-outs",
  adminBookingController.getUpcomingCheckOuts.bind(adminBookingController),
);

export default router;
