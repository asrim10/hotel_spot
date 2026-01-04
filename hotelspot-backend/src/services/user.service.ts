import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repositories";
import bcryptjs from "bcryptjs";
let userRepositoory = new UserRepository();
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";

export class UserService {
  async createUser(data: CreateUserDTO) {
    //business logic before creating user
    const emailCheck = await userRepositoory.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }
    const usernameCheck = await userRepositoory.getUserByUsername(
      data.username
    );
    if (usernameCheck) {
      throw new HttpError(403, "Username already in use");
    }
    //hash password
    const hashedPassword = await bcryptjs.hash(data.password, 10); //10 complexity
    data.password = hashedPassword;

    //create user
    const newUser = await userRepositoory.createUser(data);
    return newUser;
  }
}
