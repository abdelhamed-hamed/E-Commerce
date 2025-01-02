import mongoose from "mongoose";
import { Reviews } from "./reviews.interface";
import productsSchema from "../products/products.schema";

const reviewsSchema = new mongoose.Schema<Reviews>(
  {
    comment: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    rate: Number,
  },
  { timestamps: true }
);

reviewsSchema.statics.calcRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingAverage: { $avg: "$rate" },
        sum: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await productsSchema.findByIdAndUpdate(productId, {
      rateAvg: result[0].ratingAverage,
      rating: result[0].sum,
    });
  } else {
    await productsSchema.findByIdAndUpdate(productId, {
      rateAvg: 0,
      rating: 0,
    });
  }
};

reviewsSchema.post<Reviews>("save", async function () {
  await (this.constructor as any).calcRating(this.product);
});

reviewsSchema.post<Reviews>("findOneAndUpdate", async function (doc: Reviews) {
  await (doc.constructor as any).calcRating(doc.product);
});

reviewsSchema.post<Reviews>("findOneAndDelete", async function (doc: Reviews) {
  await (doc.constructor as any).calcRating(doc.product);
});

reviewsSchema.pre<Reviews>(/^find/, function (next) {
  this.populate({ path: "user", select: "name image" });
  next();
});
export default mongoose.model<Reviews>("reviews", reviewsSchema);
