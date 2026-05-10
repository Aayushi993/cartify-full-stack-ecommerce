import crypto from "crypto";
import mongoose from "mongoose";
import { Payment } from "./payment.model";
import { Order } from "../orders/order.model";
import { AppError } from "../../utils/AppError";

type PaymentMethod = "UPI" | "CARD" | "COD" | "UNKNOWN";

export const paymentService = {
  async createPayment(orderId: string, userId: string) {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.status !== "PENDING") {
      throw new AppError("Order cannot be paid in current status", 400);
    }

    const existingPayment = await Payment.findOne({ orderId, userId });

    if (existingPayment) {
      if (existingPayment.status === "SUCCESS") {
        throw new AppError("Order payment already completed", 400);
      }

      if (existingPayment.status === "CREATED") {
        return existingPayment;
      }

      existingPayment.status = "CREATED";
      existingPayment.transactionId = undefined;
      existingPayment.amount = order.totalAmount;
      existingPayment.method = "UNKNOWN";

      await existingPayment.save();

      return existingPayment;
    }

    try {
      return await Payment.create({
        orderId: new mongoose.Types.ObjectId(orderId),
        userId: new mongoose.Types.ObjectId(userId),
        amount: order.totalAmount,
        status: "CREATED",
        provider: "MOCK",
        method: "UNKNOWN",
      });
    } catch (error: any) {
      if (error.code === 11000) {
        const payment = await Payment.findOne({ orderId, userId });

        if (payment) {
          return payment;
        }
      }

      throw error;
    }
  },

  async confirmPayment(
    paymentId: string,
    userId: string,
    method: PaymentMethod,
  ) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const payment = await Payment.findOne({
        _id: paymentId,
        userId,
      }).session(session);

      if (!payment) {
        throw new AppError("Payment not found", 404);
      }

      if (payment.status !== "CREATED") {
        throw new AppError("Payment already processed", 400);
      }

      const order = await Order.findOne({
        _id: payment.orderId,
        userId,
      }).session(session);

      if (!order) {
        throw new AppError("Order not found", 404);
      }

      if (order.status !== "PENDING") {
        throw new AppError("Order cannot be paid in current status", 400);
      }

      const isSuccess = method === "COD" ? true : Math.random() > 0.2;

      payment.status = isSuccess ? "SUCCESS" : "FAILED";
      payment.transactionId = crypto.randomUUID();
      payment.method = method;

      await payment.save({ session });

      if (isSuccess) {
        order.status = "PAID";
        await order.save({ session });
      }

      await session.commitTransaction();

      return payment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },
};