import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";

class AddressValidation {
  addAddress = [
    body("address")
      .notEmpty()
      .withMessage((val, { req }) => req.__("required")),
    validatorMiddleware,
  ];

  deleteAddress = [
    param("addressId")
      .isMongoId()
      .withMessage((val, { req }) => req.__("id")),
    validatorMiddleware,
  ];
}

const addressValidation = new AddressValidation();
export default addressValidation;
