import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  brand: string;
  sku: string;
  category:
    | "Electronics"
    | "Fashion"
    | "Home"
    | "Beauty"
    | "Sports"
    | "Toys"
    | "Books"
    | "Other";
  description: string;
  mrp: number;
  sellingPrice: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  quantity: number;
  images: { url: string; publicId: string }[];
  isActive: boolean;
  sellerId: mongoose.Types.ObjectId;
  rating: number;
  reviewCount: number;
}

const productSchema = new Schema<IProduct>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home",
        "Beauty",
        "Sports",
        "Toys",
        "Books",
        "Other",
      ],
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    mrp: {
      type: Number,
      required: true,
      min: 1,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 1,
    },

    stockStatus: {
      type: String,
      enum: ["IN_STOCK", "OUT_OF_STOCK"],
      default: "IN_STOCK",
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ title: "text", brand: "text", description: "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);