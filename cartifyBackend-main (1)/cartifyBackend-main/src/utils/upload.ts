import multer from "multer";
import { AppError } from "./AppError";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 5,
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new AppError("Only JPG, PNG, and WEBP images are allowed", 400),
      );
    }

    callback(null, true);
  },
});