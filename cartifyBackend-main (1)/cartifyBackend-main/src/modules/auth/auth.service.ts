import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "./user.model";
import { AppError } from "../../utils/AppError";
import { env } from "../../config/env";

type AuthPayload = {
  mode: "login" | "register";
  name?: string;
  email: string;
  password: string;
};

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const authService = {
  async signupOrLogin(payload: AuthPayload) {
    const email = payload.email.toLowerCase().trim();
    const password = payload.password;
    const mode = payload.mode;

    let user = await User.findOne({ email });

    if (mode === "register") {
      if (user) {
        throw new AppError("User already exists", 409);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name: payload.name?.trim(),
        email,
        password: hashedPassword,
      });
    }

    if (mode === "login") {
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }

      if (user.isBlocked) {
        throw new AppError("User is blocked", 403);
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new AppError("Invalid credentials", 401);
      }
    }

    if (!user) {
      throw new AppError("Authentication failed", 500);
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    return {
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  accessToken,
  token: accessToken,
  refreshToken,
};
  },
};