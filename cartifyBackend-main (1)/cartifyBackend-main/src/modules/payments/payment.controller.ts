import { Response } from "express";
import { z } from "zod";
import { paymentService } from "./payment.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { validateObjectId } from "../../utils/validators";

const createPaymentSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

const confirmPaymentSchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  method: z.enum(["UPI", "CARD", "COD", "UNKNOWN"]).default("UNKNOWN"),
});

export const paymentController = {
  async create(req: AuthRequest, res: Response) {
    const { orderId } = createPaymentSchema.parse(req.body);
    validateObjectId(orderId, "order id");

    const payment = await paymentService.createPayment(
      orderId,
      req.user!.userId,
    );

    res.json({
      success: true,
      message: "Payment initiated",
      data: payment,
    });
  },

  async confirm(req: AuthRequest, res: Response) {
    const { paymentId, method } = confirmPaymentSchema.parse(req.body);
    validateObjectId(paymentId, "payment id");

    const payment = await paymentService.confirmPayment(
      paymentId,
      req.user!.userId,
      method,
    );

    res.json({
      success: true,
      message:
        payment.status === "SUCCESS" ? "Payment successful" : "Payment failed",
      data: payment,
    });
  },
};