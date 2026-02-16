import axios from "axios";
import { API } from "./endpoints";

export const getAllHotels = async (
  page: number = 1,
  size: number = 20,
  search?: string,
) => {
  try {
    const response = await axios.get(API.HOTELS.GET_ALL, {
      params: { page, size, search },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get hotels failed",
    );
  }
};

export const getHotelById = async (id: string) => {
  try {
    const response = await axios.get(API.HOTELS.GET_ONE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get hotel by id failed",
    );
  }
};
