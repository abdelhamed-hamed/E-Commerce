import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import usersSchema from "./users.schema";
class UsersValidation {
  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];

  creat = [
    body("username")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length"))
      .custom(async (value: String, { req }) => {
        const username = await usersSchema.findOne({ username: value });
        if (username) throw new Error(req.__("duplicated-user"));
        return true;
      }),

    body("email")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isEmail()
      .withMessage((val, { req }) => req.__("invalid-email"))
      .custom(async (value: String, { req }) => {
        const email = await usersSchema.findOne({ email: value });
        if (email) throw new Error(req.__("duplicated-user"));
        return true;
      }),

    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 2, max: 15 })
      .withMessage((val, { req }) => req.__("sm-length")),

    body("password")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password")),

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
    body("password")
      .notEmpty()
      .withMessage((val, { req }) => req.__("new-password"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password")),

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

const usersValidation = new UsersValidation();
export default usersValidation;
