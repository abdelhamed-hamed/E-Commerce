import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { Users } from "./users.interface";

const usersSchema = new mongoose.Schema<Users>(
  {
    username: { type: String, unique: true, trim: true, required: true },
    email: { type: String, unique: true, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    image: { type: String, default: "user-avater.jpg" },
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },
    active: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    address: [{ street: String, city: String, state: String, zip: String }],
    googleId: String, // ال اي دي لو مسجل جوجل
    hasPassword: { type: Boolean, default: true }, // لأنه لو مسجل بي جوجل مبيكونش ليه باسوورد دي بتعمل النقطه دي
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date, // لو مرجع كود عشان اغير الباسوورد صلاحيته تبقي قد اي
    passwordResetCodeVerify: Boolean, // هل الكود مطابق الكود ولا لا
  },
  { timestamps: true }
);

// Add Base url To Image  Before Name
const imageUrl = (document: Users): any => {
  if (document.image.startsWith("user")) {
    if (document.image)
      document.image = `${process.env.BASE_URL}/images/users/${document.image}`;
  }
};

// hash password before
usersSchema.pre<Users>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

// Constant Code
usersSchema.post("init", imageUrl).post("save", imageUrl);

export default mongoose.model<Users>("users", usersSchema);
