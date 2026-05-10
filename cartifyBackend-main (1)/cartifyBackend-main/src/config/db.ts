import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};
