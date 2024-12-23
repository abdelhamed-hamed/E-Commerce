import { body, param } from "express-validator";
import categoriesSchema from "./reviews.schema";
import validatorMiddleware from "../middlewares/validator.middleware";
class CategoryValidation {
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
      .withMessage((val, { req }) => req.__("id")),

    validatorMiddleware,
  ];

  // Update Category Validation
  update = [
    body("comment")
      .optional()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 3, max: 150 })
      .withMessage((val, { req }) => req.__("minmax")),

    body("rate")
      .optional()
      .withMessage((val, { req }) => req.__("required"))
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("minmax")),

    body("user")
      .optional()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),

    body("product")
      .optional()
      .withMessage((val, { req }) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  // Delete Category VAlidation
  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const categoryValidation = new CategoryValidation();
export default categoryValidation;
