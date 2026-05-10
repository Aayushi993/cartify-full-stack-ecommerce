import { Response } from "express";
import { sellerService } from "./seller.service";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { z } from "zod";

const applySellerSchema = z
  .object({
    storeName: z.string().min(2),
    sellerType: z.enum(["individual", "business"]),
    gstNumber: z.string().optional(),
    address: z.string().min(5),
    city: z.string().min(2),
    pincode: z.string().min(4),
  })
  .refine(
    (data) => {
      if (data.sellerType === "business") return !!data.gstNumber;
      return true;
    },
    {
      message: "GST is required for business sellers",
      path: ["gstNumber"],
    },
  );

export const sellerController = {
  async apply(req: AuthRequest, res: Response) {
    const payload = applySellerSchema.parse(req.body);

    const request = await sellerService.applySeller(req.user!.userId, payload);

    res.status(201).json({
      success: true,
      message: "Seller request submitted for approval",
      data: request,
    });
  },

  async myStatus(req: AuthRequest, res: Response) {
    const request = await sellerService.getMySellerRequest(req.user!.userId);

    res.json({
      success: true,
      data: request || null,
    });
  },
};
