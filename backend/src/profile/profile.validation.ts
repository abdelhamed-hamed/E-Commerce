import bcrypt from "bcrypt";

import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";

class ProfileValidation {
  update = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length")),
    validatorMiddleware,
  ];

  delete = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  // Change Password
  changePassword = [
    body("oldPassword")
      .notEmpty()
      .withMessage((val, { req }) => req.__("old-password"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password"))
      .custom(async (val, { req }) => {
        const oldPassword = await bcrypt.compare(val, req.user.password);
        if (!oldPassword) {
          throw new Error(req.__("old-password"));
        }
        return true;
      }),

    body("password")
      .notEmpty()
      .withMessage((val, { req }) => req.__("new-password"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password"))
      .custom(async (val, { req }) => {
        const checkPassword = await bcrypt.compare(val, req.user.password);
        if (checkPassword) {
          throw new Error(req.__("new-password-typically-old"));
        }
        return true;
      }),

    body("confirmPassword")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .custom((val, { req }) => {
        if (val !== req.body.password)
          throw new Error(`${req.__("password-typical")}`);
        return true;
      }),
    validatorMiddleware,
  ];

  // creat Password
  creatPassword = [
    body("password")
      .notEmpty()
      .withMessage((val, { req }) => req.__("new-password"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password"))
      .custom((val, { req }) => {
        if (req.user.hasPassword) {
          throw new Error(req.__("account-permission"));
        }
        return true;
      }),

    body("confirmPassword")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .custom((val, { req }) => {
        if (val !== req.body.password)
          throw new Error(`${req.__("password-typical")}`);
        return true;
      }),
    validatorMiddleware,
  ];
}

const profileValidation = new ProfileValidation();
export default profileValidation;
