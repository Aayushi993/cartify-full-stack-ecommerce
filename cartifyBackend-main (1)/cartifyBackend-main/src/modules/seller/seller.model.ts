import mongoose, { Schema, Document } from "mongoose";

export interface ISellerRequest extends Document {
  userId: mongoose.Types.ObjectId;
  storeName: string;
  sellerType: "individual" | "business";
  gstNumber?: string;
  address: string;
  city: string;
  pincode: string;

  userEmail: string;
  userName: string;

  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

const sellerSchema = new Schema<ISellerRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    storeName: { type: String, required: true },

    sellerType: {
      type: String,
      enum: ["individual", "business"],
      required: true,
    },

    userName: String,
    userEmail: String,

    gstNumber: String,

    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: String,
  },
  { timestamps: true }
);

export const SellerRequest = mongoose.model<ISellerRequest>(
  "SellerRequest",
  sellerSchema
);