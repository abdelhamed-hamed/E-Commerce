import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import productsSchema from "../products/products.schema";

class WishlistValidation {
  addToWishlist = [
    body("productId")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val, { req }) => {
        const product = await productsSchema.findById(req.body.productId);
        if (!product) throw new Error(`${req.__("not-found")}`);
        return true;
      }),
    validatorMiddleware,
  ];

  deleteFromWishlist = [
    param("productId")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val, { req }) => {
        const product = await productsSchema.findById(req.params!.productId);
        if (!product) throw new Error(`${req.__("not-found")}`);
        return true;
      }),
    validatorMiddleware,
  ];
}

const wishlistValidation = new WishlistValidation();
export default wishlistValidation;
