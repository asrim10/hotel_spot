import { API } from "../endpoints";
import axios from "../axios";

export const createHotel = async (hotelData: any) => {
  try {
    const response = await axios.post(API.ADMIN.HOTEL.CREATE, hotelData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create hotel failed",
    );
  }
};

export const getHotelById = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.HOTEL.GET_ONE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Get hotel by id failed",
    );
  }
};

export const getAllHotel = async (
  page: number,
  size: number,
  search?: string,
) => {
  try {
    const response = await axios.get(API.ADMIN.HOTEL.GET_ALL, {
      params: { page, size, search },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get all hotels failed",
    );
  }
};

export const updateHotel = async (id: string, updateData: any) => {
  try {
    const response = await axios.put(API.ADMIN.HOTEL.UPDATE(id), updateData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update hotel failed",
    );
  }
};

export const deleteHotel = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.HOTEL.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete hotel failed",
    );
  }
};
