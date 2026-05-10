import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authSchema, refreshTokenSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { env } from "../../config/env";
import { User } from "./user.model";
import { AppError } from "../../utils/AppError";

export const authController = {
  async signupOrLogin(req: Request, res: Response) {
    const validatedData = authSchema.parse(req.body);

    const data = await authService.signupOrLogin(validatedData);

    res.status(200).json({
      success: true,
      message: "Auth successful",
      data,
    });
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
      role: "USER" | "ADMIN" | "SUPER_ADMIN";
    };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isBlocked) {
      throw new AppError("User is blocked", 403);
    }

    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    res.status(200).json({
      success: true,
      accessToken,
      token: accessToken,
    });
  },
};