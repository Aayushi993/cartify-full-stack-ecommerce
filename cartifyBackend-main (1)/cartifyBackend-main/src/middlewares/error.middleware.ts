import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { env } from "../config/env";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (err instanceof ZodError || err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = err instanceof ZodError ? err.issues : undefined;
  }

  if ((err as any).name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if ((err as any).code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys((err as any).keyValue || {})[0];
    message = duplicateField
      ? `${duplicateField} already exists`
      : "Duplicate field value";
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
  }

  if (err.message?.startsWith("CORS blocked")) {
    statusCode = 403;
    message = err.message;
  }

  if (env.NODE_ENV !== "production") {
    console.error("ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
};