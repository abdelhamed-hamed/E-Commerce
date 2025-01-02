import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";

class CartsValidation {
  getCart = [
    param("userId")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  deleteCart = [
    param("userId")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  addToCart = [
    body("product")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("quantity")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((req) => req.__("quantity-product")),
    validatorMiddleware,
  ];

  removeProduct = [
    param("itemId")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  UpdateQuantity = [
    param("itemId")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("quantity")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((req) => req.__("quantity-product")),
    validatorMiddleware,
  ];

  applyCoupoun = [
    body("coupoun")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const cartsValidation = new CartsValidation();
export default cartsValidation;
