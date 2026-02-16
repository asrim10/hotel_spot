import { Router } from "express";
import { HotelController } from "../controllers/hotel.controller";

const hotelController = new HotelController();

const router = Router();

router.get("/", hotelController.getAllHotels);

router.get("/:id", hotelController.getHotelById);

export default router;
