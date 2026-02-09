import { Router } from "express";
import {
  authorizedMiddleware,
  adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { AdminHotelController } from "../../controllers/admin/hotel.controller";
import { uploads } from "../../middlewares/upload.middleware";

let adminHotelController = new AdminHotelController();

const router = Router();

router.use(authorizedMiddleware); // apply all with middleware
router.use(adminMiddleware); // apply all with middleware

router.post("/", uploads.single("image"), adminHotelController.createHotel);
router.get("/", adminHotelController.getAllHotels);
router.put("/:id", uploads.single("image"), adminHotelController.updateHotel);
router.delete("/:id", adminHotelController.deleteHotel);
router.get("/:id", adminHotelController.getHotelById);

export default router;
