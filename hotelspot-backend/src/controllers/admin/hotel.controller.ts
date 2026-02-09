import { CreateHotelDTO, UpdateHotelDTO } from "../../dtos/hotel.dto";
import { Request, Response, NextFunction } from "express";
import z from "zod";
import { AdminHotelService } from "../../services/admin/hotel.service";

let adminHotelService = new AdminHotelService();

export class AdminHotelController {
  async createHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = CreateHotelDTO.safeParse(req.body); // validate request body
      if (!parsedData.success) {
        // validation failed
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }
      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }

      const hotelData: CreateHotelDTO = parsedData.data;
      const newHotel = await adminHotelService.createHotel(hotelData);
      return res
        .status(201)
        .json({ success: true, message: "Hotel Created", data: newHotel });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllHotels(req: Request, res: Response, next: NextFunction) {
    try {
      const hotels = await adminHotelService.getAllHotels();
      return res
        .status(200)
        .json({ success: true, data: hotels, message: "All Hotels Retrieved" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const hotelId = req.params.id;
      const parsedData = UpdateHotelDTO.safeParse(req.body); // validate request body
      if (!parsedData.success) {
        // validation failed
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updateData: UpdateHotelDTO = parsedData.data;
      const updatedHotel = await adminHotelService.updateHotel(
        hotelId,
        updateData,
      );
      return res
        .status(200)
        .json({ success: true, message: "Hotel Updated", data: updatedHotel });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteHotel(req: Request, res: Response, next: NextFunction) {
    try {
      const hotelId = req.params.id;
      const deleted = await adminHotelService.deleteHotel(hotelId);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Hotel not found" });
      }
      return res.status(200).json({ success: true, message: "Hotel Deleted" });
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
      const hotel = await adminHotelService.getHotelById(hotelId);
      return res.status(200).json({
        success: true,
        data: hotel,
        message: "Single Hotel Retrieved",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
