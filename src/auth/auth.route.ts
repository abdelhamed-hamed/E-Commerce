import { Router } from "express";
import authService from "./auth.service";
import authValidation from "./auth-validaton";

const authRoute: Router = Router();

authRoute.post("/login", authValidation.login, authService.login);
authRoute.post("/signup", authValidation.signup, authService.signup);
export default authRoute;