import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { HotelService } from "../services/hotel.service";

const hotelService = new HotelService();

export class HotelController {
  async getAllHotels(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = (req.query.search as string) || "";

      const result = await hotelService.getAllHotels(page, size, search);

      return res.status(200).json({
        success: true,
        data: result.hotels,
        pagination: result.pagination,
        message: "Hotels Retrieved Successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getHotelById(req: Request, res: Response, next: NextFunction) {
    try {
      const hotelId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid hotel ID",
        });
      }

      const hotel = await hotelService.getHotelById(hotelId);

      return res.status(200).json({
        success: true,
        data: hotel,
        message: "Hotel Retrieved Successfully",
      });
    } catch (error: any) {
      if (error.message === "Hotel not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
