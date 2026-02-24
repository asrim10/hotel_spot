import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { InitiatePaymentDto, VerifyPaymentDto } from "../dtos/payment.dto";

const paymentService = new PaymentService();

export class PaymentController {
  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = InitiatePaymentDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
      }

      const data = await paymentService.initiatePayment(parsed.data);
      return res.status(200).json({ success: true, ...data });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = VerifyPaymentDto.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.flatten() });
      }

      const data = await paymentService.verifyPayment(parsed.data.pidx);
      return res.status(data.success ? 200 : 400).json(data);
    } catch (error) {
      next(error);
    }
  }
}
