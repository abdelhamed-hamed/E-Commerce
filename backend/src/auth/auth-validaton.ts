import { body } from "express-validator";
import usersSchema from "../users/users.schema";
import validatorMiddleware from "../middlewares/validator.middleware";

class AuthValidation {
  login = [
    body("email")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isEmail()
      .withMessage((req) => req.__("invalid-email")),

    body("password")
      .notEmpty()
      .withMessage((req) => req.__("required"))
      .isLength({ min: 6, max: 20 })
      .withMessage((val, { req }) => req.__("invalid-password")),
  ];

  signup = [
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

  forgetPassword = [
    body("email")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required"))
      .isEmail()
      .withMessage((val, { req }) => req.__("invalid-email")),
    validatorMiddleware,
  ];

  verifyCode = [
    body("resetCode")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required")),
    validatorMiddleware,
  ];

  resetPassword = [
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
}

const authValidation = new AuthValidation();
export default authValidation;
