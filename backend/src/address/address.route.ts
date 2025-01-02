import { Router } from "express";

import authService from "../auth/auth.service";
import addressService from "./address.service";
import addressValidation from "./address.validation";

const addressRoute: Router = Router();

addressRoute.use(authService.protectedRoute, authService.checkActive);

addressRoute
  .route("/")
  .get(addressService.getAddress)
  .post(addressValidation.addAddress, addressService.addAddress);

addressRoute.delete(
  "/:addressId",
  addressValidation.deleteAddress,
  addressService.deleteAddress
);
export default addressRoute;
