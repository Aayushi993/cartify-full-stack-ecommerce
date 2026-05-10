import mongoose, { Schema, Document } from "mongoose";

interface CartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtThatTime: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: CartItem[];
}

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        priceAtThatTime: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
