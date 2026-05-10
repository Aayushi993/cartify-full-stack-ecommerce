import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../modules/auth/user.model";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");

    const email = "superadmin@test.com";
    const password = "123456";

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = "Super Admin";
      existingUser.email = email;
      existingUser.password = hashedPassword;
      existingUser.role = "SUPER_ADMIN";
      existingUser.isBlocked = false;

      await existingUser.save();

      console.log("Super admin updated successfully");
    } else {
      await User.create({
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        isBlocked: false,
      });

      console.log("Super admin created successfully");
    }

    console.log("Login email:", email);
    console.log("Login password:", password);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Failed to create super admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createSuperAdmin();