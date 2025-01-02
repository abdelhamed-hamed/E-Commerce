import { body, param } from "express-validator";
import categoriesSchema from "./copouns.schema";
import validatorMiddleware from "../middlewares/validator.middleware";

class CopounsValidation {
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  creat = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("md-length")),

    body("discount")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("minmax-discount")),

    body("expiredTime")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isDate()
      .withMessage((val, { req }) => req.__("invalid")),
    validatorMiddleware,
  ];

  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),

    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("md-length")),

    body("discount")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("minmax-discount")),

    body("expiredTime")
      .optional()
      .isDate()
      .withMessage((val, { req }) => req.__("invalid")),
    validatorMiddleware,
  ];

  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const copounsValidation = new CopounsValidation();
export default copounsValidation;
