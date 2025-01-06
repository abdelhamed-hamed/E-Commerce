import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";

class OrdersValidation {
  getOne = [
    param("id")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  deleteOne = [
    param("id")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  creatCashOrder = [
    body("address")
      .notEmpty()
      .withMessage((req) => req.__("required")),
    validatorMiddleware,
  ];
}

const ordersValidation = new OrdersValidation();
export default ordersValidation;
