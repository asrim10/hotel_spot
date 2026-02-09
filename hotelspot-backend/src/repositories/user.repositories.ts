import { tr } from "zod/v4/locales";
import { UserModel, IUser } from "../models/user.model";
import { QueryFilter } from "mongoose";

export interface IUserRepository {
  createUser(userData: Partial<IUser>): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  //Additional
  getUserByID(id: string): Promise<IUser | null>;
  getAllUsers(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ users: IUser[]; total: number }>;
  updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
  deleteUserById(id: string): Promise<boolean>;
}
// Mongodb inmplementation of UserRepository
export class UserRepository implements IUserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return await user.save();
  }
  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email });
    return user;
  }
  async getUserByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username: username });
    return user;
  }

  async getUserByID(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    return user;
  }
  async getAllUsers(
    page: number,
    size: number,
    search?: string,
  ): Promise<{ users: IUser[]; total: number }> {
    const filter: QueryFilter<IUser> = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .skip((page - 1) * size)
        .limit(size),
      UserModel.countDocuments(filter),
    ]);
    return { users, total };
  }
  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }, // return updated document
    );
    return updateUser;
  }
  async deleteUserById(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result ? true : false;
  }
}
