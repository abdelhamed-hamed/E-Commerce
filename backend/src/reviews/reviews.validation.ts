import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import productsSchema from "../products/products.schema";
import reviewsSchema from "./reviews.schema";
class ReviewsValidation {
  //    Check If Id Valid OR No
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  creat = [
    body("comment")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 3, max: 150 })
      .withMessage((val, { req }) => req.__("minmax")),

    body("rate")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("minmax")),

    body("user")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),

    body("product")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val, { req }) => {
        const review = await reviewsSchema.findOne({
          user: req.user.id,
          product: req.body.product,
        });
        if (review) throw new Error(req.__("cannot-creat"));
        return true;
      }),
    validatorMiddleware,
  ];

  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val, { req }) => {
        const review = await reviewsSchema.findById(val);
        if (review?.user!._id!.toString() !== req.user._id.toString())
          throw new Error(req.__("cannot-update"));
        return true;
      }),

    body("comment")
      .optional()
      .isLength({ min: 3, max: 150 })
      .withMessage((val, { req }) => req.__("minmax")),

    body("rate")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("minmax")),
    validatorMiddleware,
  ];

  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id"))
      .custom(async (val, { req }) => {
        if (req.user.role == "user") {
          const review = await reviewsSchema.findById(val);
          if (review?.user!._id!.toString() !== req.user._id.toString())
            throw new Error(req.__("cannot-delete"));
        }
        return true;
      }),
    validatorMiddleware,
  ];
}

const reviewsValidation = new ReviewsValidation();
export default reviewsValidation;
