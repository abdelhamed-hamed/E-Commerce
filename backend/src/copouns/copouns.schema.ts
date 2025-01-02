import mongoose from "mongoose";
import { Copouns } from "./copouns.interface";

const copounsSchema = new mongoose.Schema<Copouns>(
  {
    name: { type: String, required: true },
    discount: Number,
    expiredTime: Date,
  },
  { timestamps: true }
);

export default mongoose.model<Copouns>("copouns", copounsSchema);
