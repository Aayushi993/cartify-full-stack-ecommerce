import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { orderService } from "./order.service";
import { validateObjectId } from "../../utils/validators";

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  address: z.string().trim().min(3, "Address must be at least 3 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters"),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
});

const statusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export const orderController = {
  async checkout(req: AuthRequest, res: Response) {
    const addressData = req.body.address || req.body;

    const address = addressSchema.parse({
      fullName: addressData.fullName,
      address: addressData.address,
      city: addressData.city,
      pincode: String(addressData.pincode),
    });

    const order = await orderService.createOrder(req.user!.userId, address);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  },

  async myOrders(req: AuthRequest, res: Response) {
    const orders = await orderService.myOrders(req.user!.userId);

    res.json({
      success: true,
      data: orders,
    });
  },

  async sellerOrders(req: AuthRequest, res: Response) {
    const orders = await orderService.sellerOrders(req.user!.userId);

    res.json({
      success: true,
      data: orders,
    });
  },

  async updateStatus(req: AuthRequest, res: Response) {
    validateObjectId(req.params.orderId, "order id");

    const { status } = statusSchema.parse(req.body);

    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      status,
      req.user!.userId,
      req.user!.role,
    );

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  },
};