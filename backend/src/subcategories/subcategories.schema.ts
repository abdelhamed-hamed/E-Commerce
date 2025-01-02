import mongoose from "mongoose";
import { SubCategories } from "./subcategories.interface";

const subCategoriesSchema = new mongoose.Schema<SubCategories>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "categories",
    },
    image: String,
  },
  { timestamps: true }
);

// Add Base url To Image  Before Name
const imageUrl = (document: SubCategories): any => {
  if (document.image)
    document.image = `${process.env.BASE_URL}/images/subcategories/${document.image}`;
};

// Constant Code
subCategoriesSchema.post("init", imageUrl).post("save", imageUrl);

// replace id of category to data
subCategoriesSchema.pre<SubCategories>(/^find/, function (next) {
  this.populate({ path: "category" });
  next();
});

export default mongoose.model<SubCategories>(
  "subcategories",
  subCategoriesSchema
);
