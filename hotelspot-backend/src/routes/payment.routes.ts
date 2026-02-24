import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const paymentController = new PaymentController();

router.post(
  "/khalti/initiate",
  paymentController.initiatePayment.bind(paymentController),
  authorizedMiddleware,
);
router.post(
  "/khalti/verify",
  paymentController.verifyPayment.bind(paymentController),
  authorizedMiddleware,
);

export default router;
