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
  async loginUser(data: LoginUserDTO) {
    const user = await userRepositoory.getUserByEmail(data.email);
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
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" }); // 30days
    return { token, user };
  }
}
