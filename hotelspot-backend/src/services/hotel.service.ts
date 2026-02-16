import { IHotel } from "../models/hotel.model";
import {
  HotelRepository,
  IHotelRepository,
} from "../repositories/hotel.repositories";

export interface IHotelService {
  getAllHotels(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ hotels: IHotel[]; pagination: any }>;
  getHotelById(hotelId: string): Promise<IHotel | null>;
}

export class HotelService implements IHotelService {
  private hotelRepository: IHotelRepository;

  constructor() {
    this.hotelRepository = new HotelRepository();
  }

  async getAllHotels(page: number, size: number, search?: string) {
    const { hotels, total } = await this.hotelRepository.getAllPaginated(
      page,
      size,
      search,
    );

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / size),
      totalItems: total,
      itemsPerPage: size,
    };

    return { hotels, pagination };
  }

  async getHotelById(hotelId: string): Promise<IHotel | null> {
    const hotel = await this.hotelRepository.getById(hotelId);
    return hotel;
  }
}
