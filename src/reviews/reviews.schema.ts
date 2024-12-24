import mongoose from "mongoose";
import { Reviews } from "./reviews.interface";

const reviewsSchema = new mongoose.Schema<Reviews>(
  {
    comment: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    rate: Number,
  },
  { timestamps: true }
);

export default mongoose.model<Reviews>("reviews", reviewsSchema);
