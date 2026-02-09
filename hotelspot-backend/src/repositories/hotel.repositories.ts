import { QueryFilter } from "mongoose";
import { HotelModel, IHotel } from "../models/hotel.model";

export interface IHotelRepository {
  create(hotelData: any): Promise<IHotel>;
  getById(hotelId: string): Promise<IHotel | null>;
  update(hotelId: string, hotelData: any): Promise<IHotel | null>;
  delete(hotelId: string): Promise<boolean>;
  getAll(): Promise<IHotel[]>;
  getAllPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ hotels: IHotel[]; total: number }>;
}

export class HotelRepository implements IHotelRepository {
  async create(hotelData: any): Promise<IHotel> {
    const hotel = new HotelModel(hotelData);
    const newHotel = await hotel.save();
    return newHotel;
  }

  async getAllPaginated(page: number, size: number, search?: string) {
    const query: QueryFilter<IHotel> = {};
    if (search) {
      query.$or = [
        { hotelName: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }
    const total = await HotelModel.countDocuments(query);
    const hotels = await HotelModel.find(query)
      .skip((page - 1) * size)
      .limit(size);
    return { hotels, total };
  }

  async getAll(): Promise<IHotel[]> {
    const hotels = await HotelModel.find();
    return hotels;
  }

  async getById(hotelId: string): Promise<IHotel | null> {
    const found = await HotelModel.findById(hotelId);
    return found;
  }

  async update(hotelId: string, hotelData: any): Promise<IHotel | null> {
    const updated = await HotelModel.findByIdAndUpdate(hotelId, hotelData, {
      new: true,
    });
    return updated;
  }

  async delete(hotelId: string): Promise<boolean> {
    const deleted = await HotelModel.findByIdAndDelete(hotelId);
    return deleted !== null;
  }
}
