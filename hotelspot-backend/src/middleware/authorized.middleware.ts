import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/http-error";
import { JWT_SECRET } from "../config";
import { UserRepository } from "../repositories/user.repositories";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any> | IUser;
    }
  }
}

const userRepository = new UserRepository();
export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      throw new HttpError(401, "Unauthrized Token Malformed");
    const token = authHeader.split(" ")[1]; // "Bearer <token>" [1] -> token
    if (!token) throw new HttpError(401, "Unauthorized Token Missing");
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, any>;
    if (!decoded || !decoded.id)
      throw new HttpError(401, "Unauthorized Token Invalid");

    const user = await userRepository.getUserByID(decoded.id);
    if (!user) throw new HttpError(401, "Unauthorized User Not Found");

    req.user = user;
    return next();
  } catch (error: Error | any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const adminOnlyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new HttpError(401, "Unauthorized User Not Found");
    }
    if (req.user.role !== "admin") {
      throw new HttpError(403, "Forbidden Admins Only");
    }
    return next();
  } catch (error: Error | any) {
    return res.status(error.statusCode ?? 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
