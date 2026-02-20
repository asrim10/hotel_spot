import { Request, Response } from "express";
import z from "zod";
import mongoose from "mongoose";

import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { BookingService } from "../services/booking.service";

let bookingService = new BookingService();

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const parsedData = CreateBookingDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const bookingData = {
        ...parsedData.data,
        userId: userId.toString(),
      };

      const newBooking = await bookingService.createBooking(bookingData);

      return res.status(201).json({
        success: true,
        message: "Booking Created",
        data: newBooking,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async getMyBookings(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const bookings = await bookingService.getBookingsByUserId(
        userId.toString(),
      );

      return res.status(200).json({
        success: true,
        message: "User Bookings Retrieved",
        data: bookings,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async getBookingById(req: Request, res: Response) {
    try {
      const bookingId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const booking = await bookingService.getBookingById(bookingId);

      return res.status(200).json({
        success: true,
        message: "Booking Retrieved",
        data: booking,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async updateBooking(req: Request, res: Response) {
    try {
      const bookingId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const parsedData = UpdateBookingDTO.safeParse(req.body);

      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const updatedBooking = await bookingService.updateBooking(
        bookingId,
        parsedData.data,
      );

      return res.status(200).json({
        success: true,
        message: "Booking Updated",
        data: updatedBooking,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      const bookingId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID",
        });
      }

      const deleted = await bookingService.deleteBooking(bookingId);

      return res.status(200).json({
        success: true,
        message: deleted ? "Booking Deleted" : "Booking not found",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }
}
