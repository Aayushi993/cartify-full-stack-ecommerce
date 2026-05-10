import mongoose, { Schema, Document } from "mongoose";
export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "CREATED" | "SUCCESS" | "FAILED";
  provider: "MOCK";
  method: "UPI" | "CARD" | "COD" | "UNKNOWN";
  transactionId?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CREATED", "SUCCESS", "FAILED"],
      default: "CREATED",
    },
    provider: {
      type: String,
      default: "MOCK",
    },
    method: {
      type: String,
      enum: ["UPI", "CARD", "COD", "UNKNOWN"],
      default: "UNKNOWN",
    },
    transactionId: String,
  },
  { timestamps: true },
);

paymentSchema.index({ orderId: 1, userId: 1 }, { unique: true });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
