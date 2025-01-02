import mongoose from "mongoose";
import { Categories } from "./categories.interface";

const categoriesSchema = new mongoose.Schema<Categories>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    image: String,
  },
  { timestamps: true }
);

// Add Base url To Image  Before Name
const imageUrl = (document: Categories): any => {
  if (document.image)
    document.image = `${process.env.BASE_URL}/images/categories/${document.image}`;
};

// Constant Code
categoriesSchema.post("init", imageUrl).post("save", imageUrl);

export default mongoose.model<Categories>("categories", categoriesSchema);
