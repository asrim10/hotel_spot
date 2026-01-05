import { UserRepository } from "../../repositories/user.repositories";
import bcryptjs from "bcryptjs";
import { CreateUserDTO } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";

let userRepository = new UserRepository();

export class AdminUserService {
  async createUser(data: CreateUserDTO) {
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }
    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if (usernameCheck) {
      throw new HttpError(403, "Username already in use");
    }
    const hashedPassword = await bcryptjs.hash(data.password, 10); //10 complexity
    data.password = hashedPassword;

    const newUser = await userRepository.createUser(data);
    return newUser;
  }

  async getAllUsers() {
    const users = await userRepository.getAllUsers();
    return users;
  }
  async getOneUser(id: string) {
    const user = await userRepository.getUserByID(id);
    console.log(user);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
}
