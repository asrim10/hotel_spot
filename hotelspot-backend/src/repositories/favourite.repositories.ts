import { QueryFilter } from "mongoose";
import { FavouriteModel, IFavourite } from "../models/favourite.model";

export interface IFavouriteRepository {
  add(favouriteData: any): Promise<IFavourite>;
  remove(favouriteId: string): Promise<boolean>;
  getById(favouriteId: string): Promise<IFavourite | null>;
  getByUserId(userId: string): Promise<IFavourite[]>;
  getAll(): Promise<IFavourite[]>;
}

export class FavouriteRepository implements IFavouriteRepository {
  async add(favouriteData: any): Promise<IFavourite> {
    const favourite = new FavouriteModel(favouriteData);
    const newFavourite = await favourite.save();
    return newFavourite;
  }

  async remove(favouriteId: string): Promise<boolean> {
    const deleted = await FavouriteModel.findByIdAndDelete(favouriteId);
    return deleted !== null;
  }

  async getById(favouriteId: string): Promise<IFavourite | null> {
    const favourite = await FavouriteModel.findById(favouriteId)
      .populate("hotelId")
      .populate("userId");
    return favourite;
  }

  async getByUserId(userId: string): Promise<IFavourite[]> {
    const favourites = await FavouriteModel.find({ userId })
      .populate("hotelId")
      .sort({ createdAt: -1 });
    return favourites;
  }

  async getAll(): Promise<IFavourite[]> {
    const favourites = await FavouriteModel.find()
      .populate("hotelId")
      .populate("userId")
      .sort({ createdAt: -1 });
    return favourites;
  }
}
