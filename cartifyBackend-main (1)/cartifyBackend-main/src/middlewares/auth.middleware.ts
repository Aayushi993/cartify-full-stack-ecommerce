import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/auth/user.model";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  files: Express.Multer.File[];
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as { userId: string; role: string };

    // 🔥 IMPORTANT PART STARTS HERE
    const user = await User.findById(decoded.userId);

    if (!user || user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "User blocked or not found",
      });
    }

    // attach clean user info to request
    req.user = {
      userId: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
