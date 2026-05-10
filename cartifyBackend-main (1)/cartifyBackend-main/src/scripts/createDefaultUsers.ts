import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../modules/auth/user.model";

dotenv.config();

const defaultUsers = [
  {
    name: "Super Admin",
    email: "superadmin@test.com",
    password: "123456",
    role: "SUPER_ADMIN",
  },
  {
    name: "Seller Admin",
    email: "admin@test.com",
    password: "123456",
    role: "ADMIN",
  },
  {
    name: "Normal Buyer",
    email: "user@test.com",
    password: "123456",
    role: "USER",
  },
];

const createOrUpdateUser = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const existingUser = await User.findOne({
    email: userData.email.toLowerCase(),
  });

  if (existingUser) {
    existingUser.name = userData.name;
    existingUser.email = userData.email.toLowerCase();
    existingUser.password = hashedPassword;
    existingUser.role = userData.role;
    existingUser.isBlocked = false;

    await existingUser.save();

    console.log(`${userData.role} updated: ${userData.email}`);
    return;
  }

  await User.create({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    role: userData.role,
    isBlocked: false,
  });

  console.log(`${userData.role} created: ${userData.email}`);
};

const run = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    for (const user of defaultUsers) {
      await createOrUpdateUser(user);
    }

    console.log("");
    console.log("Login accounts:");
    console.log("Superadmin: superadmin@test.com / 123456");
    console.log("Seller/Admin: admin@test.com / 123456");
    console.log("Buyer: user@test.com / 123456");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Failed to create default users:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

run();