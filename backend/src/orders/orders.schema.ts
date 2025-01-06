import mongoose from "mongoose";
import { Orders } from "./orders.interface";

const ordersSchema = new mongoose.Schema<Orders>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    itemsPrice: Number,
    taxPrice: Number,
    totalPrice: Number,
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    address: { street: String, city: String, zip: String, specialMark: String },
    payment: { type: String, enum: ["cash", "card"], default: "card" },
  },
  { timestamps: true }
);

ordersSchema.pre<Orders>(/^find/, function (next) {
  this.populate({ path: "items.product", select: "name cover" });
  next();
});

ordersSchema.pre<Orders>(/^find/, function (next) {
  this.populate({ path: "user", select: "name image" });
  next();
});

export default mongoose.model<Orders>("orders", ordersSchema);
