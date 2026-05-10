import mongoose from "mongoose";
import { AppError } from "./AppError";

export const validateObjectId = (id: string, fieldName = "id") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};

export const toPositiveInt = (
  value: unknown,
  fieldName: string,
  defaultValue?: number,
) => {
  const numberValue =
    value === undefined || value === null || value === ""
      ? defaultValue
      : Number(value);

  if (!Number.isInteger(numberValue) || Number(numberValue) < 1) {
    throw new AppError(`${fieldName} must be a positive integer`, 400);
  }

  return Number(numberValue);
};