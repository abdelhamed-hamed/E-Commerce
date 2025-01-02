import mongoose from "mongoose";
import { Carts } from "./carts.interface";

const cartsSchema = new mongoose.Schema<Carts>(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],

    totalPrice: { type: Number, default: 0 },
    totalPriceAfterDiscount: Number,
    taxPrice: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

cartsSchema.pre<Carts>(/^find/, function (next) {
  this.populate({ path: "items.product", select: "name cover" });
  next();
});

export default mongoose.model<Carts>("carts", cartsSchema);
