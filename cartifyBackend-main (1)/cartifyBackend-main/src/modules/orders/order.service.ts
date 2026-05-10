import mongoose from "mongoose";
import { Cart } from "../cart/cart.model";
import { Order } from "./order.model";
import { Product } from "../products/product.model";
import { AppError } from "../../utils/AppError";

type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  pincode: string;
};

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export const orderService = {
  async createOrder(userId: string, address: ShippingAddress) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const cart = await Cart.findOne({ userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new AppError("Cart is empty", 400);
      }

      let totalAmount = 0;

      const orderItems = [];

      for (const item of cart.items) {
        const product = await Product.findOne({
          _id: item.productId,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new AppError("Product not found", 404);
        }

        if (item.quantity > product.quantity) {
          throw new AppError(`Stock insufficient for ${product.title}`, 400);
        }

        totalAmount += item.quantity * product.sellingPrice;

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: product.sellingPrice,
        });

        product.quantity -= item.quantity;
        product.stockStatus =
          product.quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK";

        await product.save({ session });
      }

      const [order] = await Order.create(
        [
          {
            userId,
            items: orderItems,
            totalAmount,
            address,
            status: "PENDING",
          },
        ],
        { session },
      );

      await Cart.deleteOne({ userId }).session(session);

      await session.commitTransaction();

      return order;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  async myOrders(userId: string) {
    return Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });
  },

  async sellerOrders(sellerId: string) {
    const sellerProductIds = await Product.find({ sellerId }).distinct("_id");

    const sellerProductIdSet = new Set(
      sellerProductIds.map((id) => id.toString()),
    );

    const orders = await Order.find({
      "items.productId": { $in: sellerProductIds },
    })
      .populate("items.productId", "title images sellerId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return orders
      .map((order: any) => {
        const filteredItems = order.items.filter((item: any) => {
          const productId = item.productId?._id?.toString();

          return productId && sellerProductIdSet.has(productId);
        });

        return {
          _id: order._id,
          userId: order.userId,
          items: filteredItems,
          totalAmount: filteredItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0,
          ),
          address: order.address,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      })
      .filter((order) => order.items.length > 0);
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (currentUserRole === "ADMIN") {
      const sellerProductIds = await Product.find({
        sellerId: currentUserId,
      }).distinct("_id");

      const sellerProductIdSet = new Set(
        sellerProductIds.map((id) => id.toString()),
      );

      const hasSellerProduct = order.items.some((item: any) => {
        const productId = item.productId?._id?.toString();

        return productId && sellerProductIdSet.has(productId);
      });

      if (!hasSellerProduct) {
        throw new AppError("You are not allowed to update this order", 403);
      }
    }

    const transitions: Record<string, string[]> = {
      PENDING: ["PAID", "CANCELLED"],
      PAID: ["SHIPPED", "CANCELLED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!transitions[order.status].includes(status)) {
      throw new AppError(
        `Cannot change order status from ${order.status} to ${status}`,
        400,
      );
    }

    order.status = status as typeof order.status;

    await order.save();

    return order;
  },
};