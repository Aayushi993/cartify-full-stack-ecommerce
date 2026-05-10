import { SellerRequest } from "./seller.model";
import { AppError } from "../../utils/AppError";
import { User } from "../auth/user.model";

export const sellerService = {
  async applySeller(
    userId: string,
    data: {
      storeName: string;
      sellerType: "individual" | "business";
      gstNumber?: string;
      address: string;
      city: string;
      pincode: string;
    }
  ) {
    const existing = await SellerRequest.findOne({ userId });
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // 🔥 PENDING
    if (existing && existing.status === "PENDING") {
      throw new AppError("Request already pending", 400);
    }

    // 🔥 APPROVED
    if (existing && existing.status === "APPROVED") {
      throw new AppError("You are already a seller", 400);
    }

    // 🔥 REJECTED → UPDATE SAME DOC
    if (existing && existing.status === "REJECTED") {
      Object.assign(existing, {
        ...data,
        status: "PENDING",
        rejectionReason: undefined,
        userName: user.name,
        userEmail: user.email,
      });

      return existing.save();
    }

    // 🔥 CREATE NEW
    return SellerRequest.create({
      userId,
      ...data,
      userName: user.name,
      userEmail: user.email,
    });
  },

  async getMySellerRequest(userId: string) {
    return SellerRequest.findOne({ userId }).sort({ createdAt: -1 });
  },
};