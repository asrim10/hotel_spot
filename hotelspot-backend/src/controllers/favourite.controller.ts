import { Request, Response } from "express";
import z from "zod";
import mongoose from "mongoose";

import { CreateFavouriteDTO } from "../dtos/favourite.dto";
import { FavouriteService } from "../services/favourite.service";

let favouriteService = new FavouriteService();

export class FavouriteController {
  async addFavourite(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const parsedData = CreateFavouriteDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }

      const favouriteData = { ...parsedData.data, userId: userId.toString() };

      const newFavourite = await favouriteService.addFavourite(
        favouriteData,
        userId.toString(),
      );

      return res.status(201).json({
        success: true,
        message: "Hotel added to favourites",
        data: newFavourite,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async removeFavourite(req: Request, res: Response) {
    try {
      const favouriteId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(favouriteId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid favourite ID",
        });
      }

      const deleted = await favouriteService.removeFavourite(favouriteId);

      return res.status(200).json({
        success: true,
        message: deleted ? "Favourite removed" : "Favourite not found",
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async getMyFavourites(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized user not found",
        });
      }

      const favourites = await favouriteService.getFavouritesByUserId(
        userId.toString(),
      );

      return res.status(200).json({
        success: true,
        message: "User favourites retrieved",
        data: favourites,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async getFavouriteById(req: Request, res: Response) {
    try {
      const favouriteId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(favouriteId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid favourite ID",
        });
      }

      const favourite = await favouriteService.getFavouriteById(favouriteId);

      return res.status(200).json({
        success: true,
        message: "Favourite retrieved",
        data: favourite,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }
}
