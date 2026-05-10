import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db";
import { env } from "./config/env";
import app from "./app";

const PORT = env.PORT;

const bootstrap = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
