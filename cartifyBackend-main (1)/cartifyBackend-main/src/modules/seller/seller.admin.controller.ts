import { Request, Response } from "express";
import { z } from "zod";
import { SellerRequest } from "./seller.model";
import { User } from "../auth/user.model";
import { AppError } from "../../utils/AppError";
import { validateObjectId } from "../../utils/validators";

const updateSellerStatusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().trim().max(500).optional(),
});

export const sellerAdminController = {
  async listRequests(req: Request, res: Response) {
    const requests = await SellerRequest.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json({
      success: true,
      data: requests,
    });
  },

  async updateStatus(req: Request, res: Response) {
    validateObjectId(req.params.id, "seller request id");

    const { status, reason } = updateSellerStatusSchema.parse(req.body);

    const request = await SellerRequest.findById(req.params.id);

    if (!request) {
      throw new AppError("Seller request not found", 404);
    }

    if (request.status !== "PENDING") {
      throw new AppError("Request already processed", 400);
    }

    request.status = status;

    if (status === "REJECTED") {
      request.rejectionReason = reason || "Not specified";
    }

    await request.save();

    if (status === "APPROVED") {
      const user = await User.findById(request.userId);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      if (user.role !== "SUPER_ADMIN") {
        user.role = "ADMIN";
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Seller request ${status.toLowerCase()}`,
      data: request,
    });
  },
};