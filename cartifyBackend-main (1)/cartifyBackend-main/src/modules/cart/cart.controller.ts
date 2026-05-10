import { Response } from "express";
import { z } from "zod";
import { cartService } from "./cart.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { validateObjectId } from "../../utils/validators";

const quantitySchema = z.object({
  quantity: z.number().int().min(1).max(10),
});

export const cartController = {
  async add(req: AuthRequest, res: Response) {
    validateObjectId(req.body.productId, "product id");

    const cart = await cartService.addToCart(
      req.user!.userId,
      req.body.productId,
    );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cart,
    });
  },

  async get(req: AuthRequest, res: Response) {
    const cart = await cartService.getCart(req.user!.userId);

    res.json({
      success: true,
      data: cart,
    });
  },

  async update(req: AuthRequest, res: Response) {
    validateObjectId(req.params.productId, "product id");

    const { quantity } = quantitySchema.parse({
      quantity: Number(req.body.quantity),
    });

    const cart = await cartService.updateQuantity(
      req.user!.userId,
      req.params.productId,
      quantity,
    );

    res.json({
      success: true,
      message: "Cart updated",
      data: cart,
    });
  },

  async remove(req: AuthRequest, res: Response) {
    validateObjectId(req.params.productId, "product id");

    const cart = await cartService.removeItem(
      req.user!.userId,
      req.params.productId,
    );

    res.json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  },
};