import { Router } from "express";
import { FavouriteController } from "../controllers/favourite.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const favouriteController = new FavouriteController();

router.post("/", authorizedMiddleware, favouriteController.addFavourite);

router.delete(
  "/:id",
  authorizedMiddleware,
  favouriteController.removeFavourite,
);

router.get("/me", authorizedMiddleware, favouriteController.getMyFavourites);

router.get("/:id", authorizedMiddleware, favouriteController.getFavouriteById);

export default router;
