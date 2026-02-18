import { Request, Response } from "express";
import { AdminBookingService } from "../../services/admin/booking.service";
import { UpdateBookingDTO } from "../../dtos/booking.dto";
import { HttpError } from "../../errors/http-error";

const adminBookingService = new AdminBookingService();

export class AdminBookingController {
  async getAllBookings(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = req.query.search as string;

      const result = await adminBookingService.getAllBookings(
        page,
        size,
        search,
      );

      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: result.bookings,
        pagination: {
          page: result.page,
          size: result.size,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve bookings",
      });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await adminBookingService.getBookingById(id);

      res.status(200).json({
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve booking",
      });
    }
  }

  async getBookingsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const bookings = await adminBookingService.getBookingsByUserId(userId);

      res.status(200).json({
        success: true,
        message: "User bookings retrieved successfully",
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve user bookings",
      });
    }
  }

  async createBooking(req: Request, res: Response) {
    try {
      const bookingData = req.body;
      const newBooking = await adminBookingService.createBooking(bookingData);

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: newBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to create booking",
      });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateBookingDTO = req.body;

      const updatedBooking = await adminBookingService.updateBooking(
        id,
        updateData,
      );

      res.status(200).json({
        success: true,
        message: "Booking updated successfully",
        data: updatedBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update booking",
      });
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new HttpError(400, "Status is required");
      }

      const updatedBooking = await adminBookingService.updateBookingStatus(
        id,
        status,
      );

      res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        data: updatedBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update booking status",
      });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus } = req.body;

      if (!paymentStatus) {
        throw new HttpError(400, "Payment status is required");
      }

      const updatedBooking = await adminBookingService.updatePaymentStatus(
        id,
        paymentStatus,
      );

      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: updatedBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to update payment status",
      });
    }
  }

  async confirmBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const confirmedBooking = await adminBookingService.confirmBooking(id);

      res.status(200).json({
        success: true,
        message: "Booking confirmed successfully",
        data: confirmedBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to confirm booking",
      });
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const cancelledBooking = await adminBookingService.cancelBooking(
        id,
        reason,
      );

      res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: cancelledBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to cancel booking",
      });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkedInBooking = await adminBookingService.checkIn(id);

      res.status(200).json({
        success: true,
        message: "Guest checked in successfully",
        data: checkedInBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to check in guest",
      });
    }
  }

  async checkOut(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const checkedOutBooking = await adminBookingService.checkOut(id);

      res.status(200).json({
        success: true,
        message: "Guest checked out successfully",
        data: checkedOutBooking,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to check out guest",
      });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await adminBookingService.deleteBooking(id);

      res.status(200).json({
        success: true,
        message: "Booking deleted successfully",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to delete booking",
      });
    }
  }

  async getBookingStats(req: Request, res: Response) {
    try {
      const stats = await adminBookingService.getBookingStats();

      res.status(200).json({
        success: true,
        message: "Booking statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve booking statistics",
      });
    }
  }

  async getBookingsByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const bookings = await adminBookingService.getBookingsByStatus(
        status as any,
      );

      res.status(200).json({
        success: true,
        message: `Bookings with status '${status}' retrieved successfully`,
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve bookings by status",
      });
    }
  }

  async getBookingsByPaymentStatus(req: Request, res: Response) {
    try {
      const { paymentStatus } = req.params;
      const bookings = await adminBookingService.getBookingsByPaymentStatus(
        paymentStatus as any,
      );

      res.status(200).json({
        success: true,
        message: `Bookings with payment status '${paymentStatus}' retrieved successfully`,
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.message || "Failed to retrieve bookings by payment status",
      });
    }
  }

  async getBookingsByDateRange(req: Request, res: Response) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        throw new HttpError(400, "Start and end dates are required");
      }

      const bookings = await adminBookingService.getBookingsByDateRange(
        start as string,
        end as string,
      );

      res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve bookings by date range",
      });
    }
  }

  async getUpcomingCheckIns(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const bookings = await adminBookingService.getUpcomingCheckIns(days);

      res.status(200).json({
        success: true,
        message: `Upcoming check-ins for next ${days} days retrieved successfully`,
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve upcoming check-ins",
      });
    }
  }

  async getUpcomingCheckOuts(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const bookings = await adminBookingService.getUpcomingCheckOuts(days);

      res.status(200).json({
        success: true,
        message: `Upcoming check-outs for next ${days} days retrieved successfully`,
        data: bookings,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve upcoming check-outs",
      });
    }
  }
}
