import dotenv from "dotenv";
dotenv.config();

export const PORT: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : 3000;
export const MONGODB_URI: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/defaultdb";

//Application level constant, with fallbacks
// if .env variables are not set

export const JWT_SECRET: string = process.env.JWT_SECRET || "default";
