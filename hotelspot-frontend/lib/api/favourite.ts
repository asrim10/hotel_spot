import axios from "./axios";
import { API } from "./endpoints";

export const addFavourite = async (hotelId: string) => {
  try {
    const response = await axios.post(API.FAVOURITE.CREATE, { hotelId });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Add favourite failed",
    );
  }
};

export const getMyFavourites = async () => {
  try {
    const response = await axios.get(API.FAVOURITE.GET_MY);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get my favourites failed",
    );
  }
};

export const getFavouriteById = async (favouriteId: string) => {
  try {
    const response = await axios.get(API.FAVOURITE.GET_ONE(favouriteId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get favourite failed",
    );
  }
};

export const removeFavourite = async (favouriteId: string) => {
  try {
    const response = await axios.delete(API.FAVOURITE.DELETE(favouriteId));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Remove favourite failed",
    );
  }
};
