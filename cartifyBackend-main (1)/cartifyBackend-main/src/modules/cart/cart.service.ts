import mongoose from "mongoose";
import { Cart } from "./cart.model";
import { Product } from "../products/product.model";
import { AppError } from "../../utils/AppError";

const MAX_CART_QTY = 10;

export const cartService = {
  async addToCart(userId: string, productId: string) {
    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      throw new AppError("Product not available", 404);
    }

    if (product.quantity < 1) {
      throw new AppError("Product is out of stock", 400);
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return Cart.create({
        userId,
        items: [
          {
            productId: new mongoose.Types.ObjectId(productId),
            quantity: 1,
            priceAtThatTime: product.sellingPrice,
          },
        ],
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      const nextQuantity = cart.items[itemIndex].quantity + 1;

      if (nextQuantity > MAX_CART_QTY) {
        throw new AppError("Maximum cart quantity is 10", 400);
      }

      if (nextQuantity > product.quantity) {
        throw new AppError("Not enough stock available", 400);
      }

      cart.items[itemIndex].quantity = nextQuantity;
      cart.items[itemIndex].priceAtThatTime = product.sellingPrice;
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity: 1,
        priceAtThatTime: product.sellingPrice,
      });
    }

    await cart.save();

    return cart.populate("items.productId");
  },

  async getCart(userId: string) {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return {
        userId,
        items: [],
      };
    }

    cart.items = cart.items.filter((item: any) => {
      return item.productId && item.productId.isActive !== false;
    });

    return cart;
  },

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_CART_QTY) {
      throw new AppError("Quantity must be between 1 and 10", 400);
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      throw new AppError("Product not available", 404);
    }

    if (quantity > product.quantity) {
      throw new AppError("Not enough stock available", 400);
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
      throw new AppError("Item not in cart", 404);
    }

    item.quantity = quantity;
    item.priceAtThatTime = product.sellingPrice;

    await cart.save();

    return cart.populate("items.productId");
  },

  async removeItem(userId: string, productId: string) {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();

    return cart.populate("items.productId");
  },
};