import mongoose from "mongoose";
import { Products } from "./products.interface";

const ProductsSchema = new mongoose.Schema<Products>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "categories",
    },

    subcategory: {
      type: mongoose.Schema.ObjectId,
      ref: "subcategories",
    },

    price: {
      type: Number,
      required: true,
    },

    discount: Number,

    priceAfterDiscount: Number,

    quantity: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    rateAvg: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    cover: String,
    images: Array<String>,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

ProductsSchema.virtual("reviews", {
  localField: "_id",
  foreignField: "product",
  ref: "reviews",
});

// Add Base url To Image  Before Name
const imageUrl = (document: Products): any => {
  if (document.cover)
    document.cover = `${process.env.BASE_URL}/images/products/${document.cover}`;

  if (document.images)
    document.images = document.images.map(
      (image) => `${process.env.BASE_URL}/images/products/${image}`
    );
};

// Constant Code
ProductsSchema.post("init", imageUrl).post("save", imageUrl);

// Get Subcategory By ID
ProductsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: "category" });
  next();
});

// Get Subcategory By ID
ProductsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path: "subcategory" });
  next();
});

export default mongoose.model<Products>("products", ProductsSchema);
