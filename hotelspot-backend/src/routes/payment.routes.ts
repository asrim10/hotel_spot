import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();
const paymentController = new PaymentController();

router.post(
  "/khalti/initiate",
  authorizedMiddleware,
  paymentController.initiatePayment.bind(paymentController),
);
router.post(
  "/khalti/verify",
  authorizedMiddleware,
  paymentController.verifyPayment.bind(paymentController),
);

export default router;
