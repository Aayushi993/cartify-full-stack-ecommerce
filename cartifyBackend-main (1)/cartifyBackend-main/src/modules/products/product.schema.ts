import { z } from "zod";

export const productCategories = [
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
  "Other",
] as const;

const productBaseSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  brand: z.string().trim().min(2, "Brand must be at least 2 characters"),
  category: z.enum(productCategories),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  mrp: z.number().positive("MRP must be greater than 0"),
  sellingPrice: z.number().positive("Selling price must be greater than 0"),
  quantity: z.number().int().nonnegative("Quantity cannot be negative"),
});

export const createProductSchema = productBaseSchema.refine(
  (data) => data.sellingPrice <= data.mrp,
  {
    path: ["sellingPrice"],
    message: "Selling price cannot be greater than MRP",
  },
);

export const updateProductSchema = productBaseSchema.partial().refine(
  (data) => {
    if (
      data.mrp !== undefined &&
      data.sellingPrice !== undefined &&
      data.sellingPrice > data.mrp
    ) {
      return false;
    }

    return true;
  },
  {
    path: ["sellingPrice"],
    message: "Selling price cannot be greater than MRP",
  },
);