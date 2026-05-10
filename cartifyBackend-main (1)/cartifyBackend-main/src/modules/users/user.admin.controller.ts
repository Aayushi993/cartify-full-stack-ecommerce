import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../auth/user.model";
import { AppError } from "../../utils/AppError";
import { validateObjectId, toPositiveInt } from "../../utils/validators";

const updateRoleSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["USER", "ADMIN"]),
});

export const superAdminController = {
  async listUsers(req: Request, res: Response) {
    const search = String(req.query.search || "").trim();
    const page = toPositiveInt(req.query.page, "page", 1);
    const limit = Math.min(toPositiveInt(req.query.limit, "limit", 10), 100);

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-password");

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  },

  async updateRole(req: Request, res: Response) {
    const { userId, role } = updateRoleSchema.parse(req.body);
    validateObjectId(userId, "user id");

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "SUPER_ADMIN") {
      throw new AppError("Cannot change super admin role", 403);
    }

    user.role = role;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    res.json({
      success: true,
      message: "Role updated",
      data: updatedUser,
    });
  },

  async toggleBlock(req: Request, res: Response) {
    validateObjectId(req.params.userId, "user id");

    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role === "SUPER_ADMIN") {
      throw new AppError("Cannot block super admin", 403);
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
    });
  },
};