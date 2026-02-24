import { CreateHotelDTO, UpdateHotelDTO } from "../../dtos/hotel.dto";
import { HotelRepository } from "../../repositories/hotel.repositories";
import { HttpError } from "../../errors/http-error";
import { geocodeAddress } from "../../config/geocode";

let hotelRepository = new HotelRepository();

export class AdminHotelService {
  async createHotel(data: CreateHotelDTO) {
    if (!data.coordinates) {
      const coords = await geocodeAddress(
        data.address,
        data.city,
        data.country,
      );
      if (coords) data.coordinates = coords;
    }

    const newHotel = await hotelRepository.create(data);
    return newHotel;
  }

  async getAllHotels() {
    const hotels = await hotelRepository.getAll();
    return hotels;
  }

  async deleteHotel(id: string) {
    const hotel = await hotelRepository.getById(id);
    if (!hotel) {
      throw new HttpError(404, "Hotel not found");
    }
    const deleted = await hotelRepository.delete(id);
    return deleted;
  }

  async updateHotel(id: string, updateData: UpdateHotelDTO) {
    const hotel = await hotelRepository.getById(id);
    if (!hotel) {
      throw new HttpError(404, "Hotel not found");
    }

    const locationChanged =
      updateData.address || updateData.city || updateData.country;
    if (locationChanged && !updateData.coordinates) {
      const coords = await geocodeAddress(
        updateData.address ?? hotel.address,
        updateData.city ?? hotel.city,
        updateData.country ?? hotel.country,
      );
      if (coords) updateData.coordinates = coords;
    }

    const updatedHotel = await hotelRepository.update(id, updateData);
    return updatedHotel;
  }

  async getHotelById(id: string) {
    const hotel = await hotelRepository.getById(id);
    if (!hotel) {
      throw new HttpError(404, "Hotel not found");
    }
    return hotel;
  }
}
