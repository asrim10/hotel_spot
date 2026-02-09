import { API } from "../endpoints";
import axios from "../axios";

export const createUser = async (userData: any) => {
  try {
    const response = await axios.post(API.ADMIN.USER.CREATE, userData, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create user failed",
    );
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ONE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get user by id failed",
    );
  }
};

export const getAllUsers = async (
  page: number,
  size: number,
  search?: string,
) => {
  try {
    const response = await axios.get(API.ADMIN.USER.GET_ALL, {
      params: { page, size, search },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Get all users failed",
    );
  }
};

export const updateUser = async (id: string, updateData: any) => {
  try {
    const response = await axios.put(API.ADMIN.USER.UPDATE(id), updateData, {
      headers: {
        "Content-Type": "multipart/form-data", // for file upload/multer
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update user failed",
    );
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete(API.ADMIN.USER.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete user failed",
    );
  }
};
