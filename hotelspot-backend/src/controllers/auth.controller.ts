import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import z, { success } from "zod";

let userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const userData: CreateUserDTO = parsedData.data;
      const newUser = await userService.createUser(userData);
      return res
        .status(201)
        .json({ success: true, message: "User Created", data: newUser });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsedData.error),
        });
      }
      const loginData: LoginUserDTO = parsedData.data;
      const { token, user } = await userService.loginUser(loginData);
      return res.status(200).json({
        success: true,
        message: "Login Successful",
        data: user,
        token,
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User Id Not found" });
      }
      const user = await userService.getUserById(userId);
      return res.status(200).json({
        success: true,
        data: user,
        message: "User profile fetched successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User Id Not found" });
      }
      const parsedData = UpdateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) }); // z.prettifyError - better error messages (zod)
      }
      if (req.file) {
        parsedData.data.imageUrl = `/uploads/${req.file.filename}`;
      }
      const updatedUser = await userService.updateUser(userId, parsedData.data);
      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User profile updated successfully",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      const result = await userService.deleteUser(userId);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Service Error",
      });
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const email = req.body.email;
      if (!email) {
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      }
      const user = await userService.sendResetPasswordEmail(email);
      return res.status(200).json({
        success: true,
        data: user,
        message: "Password reset email sent",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
