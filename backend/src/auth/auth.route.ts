import { Router } from "express";
import authService from "./auth.service";
import authValidation from "./auth-validaton";

const authRoute: Router = Router();

authRoute.post("/login", authValidation.login, authService.login);
authRoute.post("/signup", authValidation.signup, authService.signup);
authRoute.post("/admin-login", authValidation.login, authService.adminLogin);

authRoute.post(
  "/forget-password",
  authValidation.forgetPassword,
  authService.forgetPassword
);

authRoute.post(
  "/verify-code",
  authValidation.verifyCode,
  authService.verifyCode
);

authRoute.post(
  "/reset-password",
  authValidation.resetPassword,
  authService.resetPassword
);

export default authRoute;
