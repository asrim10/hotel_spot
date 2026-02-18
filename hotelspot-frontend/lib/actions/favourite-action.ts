"use server";

import { getHotelById } from "@/lib/api/hotel";
import {
  addFavourite,
  getMyFavourites,
  removeFavourite,
} from "@/lib/api/favourite";

export const handleAddFavourite = async (hotelId: string) => {
  try {
    const response = await addFavourite(hotelId);

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to add favourite",
      };
    }

    const hotelInfo = await getHotelById(hotelId);

    return {
      success: true,
      message: "Hotel added to favourites",
      data: {
        favourite: response.data,
        hotel: hotelInfo.success ? hotelInfo.data : null,
      },
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Add favourite action failed",
    };
  }
};

export const handleGetMyFavourites = async () => {
  try {
    const response = await getMyFavourites();

    if (!response.success) {
      return {
        success: false,
        message: response.message || "Failed to get favourites",
      };
    }

    const favouritesWithHotels = await Promise.all(
      response.data.map(async (fav: any) => {
        const hotelInfo = await getHotelById(fav.hotelId);
        return { ...fav, hotel: hotelInfo.success ? hotelInfo.data : null };
      }),
    );

    return {
      success: true,
      message: "User favourites retrieved",
      data: favouritesWithHotels,
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Get favourites action failed",
    };
  }
};

export const handleRemoveFavourite = async (favouriteId: string) => {
  try {
    const response = await removeFavourite(favouriteId);

    return response.success
      ? {
          success: true,
          message: "Favourite removed successfully",
          data: response.data,
        }
      : {
          success: false,
          message: response.message || "Failed to remove favourite",
        };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Remove favourite action failed",
    };
  }
};
