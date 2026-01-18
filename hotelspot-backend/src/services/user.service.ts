import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repositories";
import bcryptjs from "bcryptjs";
let userRepository = new UserRepository();
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";

export class UserService {
  async createUser(data: CreateUserDTO) {
    //business logic before creating user
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }
    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if (usernameCheck) {
      throw new HttpError(403, "Username already in use");
    }
    //hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10); //10 complexity
    data.password = hashedPassword;

    //create user
    const newUser = await userRepository.createUser(data);
    return newUser;
  }
  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const validPassword = await bcryptjs.compare(data.password, user.password);
    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }
    //generate jwt
    const payload = {
      id: user._id,
      email: user.email,
      username: user.email,
      password: user.password,
      fullName: user.fullName,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" }); // 30days
    return { token, user };
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const existingUser = await userRepository.getUserByID(userId);
    if (!existingUser) {
      throw new HttpError(404, "User not found");
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await userRepository.getUserByEmail(data.email);
      if (emailExists) {
        throw new HttpError(403, "Email already in use");
      }
    }

    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await userRepository.getUserByUsername(
        data.username
      );
      if (usernameExists) {
        throw new HttpError(403, "Username already in use");
      }
    }
  }

  async deleteUser(userId: string) {
    const existingUser = await userRepository.getUserByID(userId);
    if (!existingUser) {
      throw new HttpError(404, "User not found");
    }

    const deleted = await userRepository.deleteUserById(userId);
    if (!deleted) {
      throw new HttpError(500, "Failed to delete user");
    }

    return { message: "User deleted successfully" };
  }
}
