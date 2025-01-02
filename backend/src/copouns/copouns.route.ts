import { Router } from "express";

import authService from "../auth/auth.service";
import copounsService from "./copouns.service";
import copounsValidation from "./copouns.validation";

const copounsRouter: Router = Router();

copounsRouter.use(
  authService.protectedRoute,
  authService.checkActive,
  authService.allowedTo("admin", "employee")
);

copounsRouter
  .route("/")
  .get(copounsService.getAll)
  .post(copounsValidation.creat, copounsService.create);

copounsRouter
  .route("/:id")
  .get(copounsValidation.getOne, copounsService.getOne)
  .put(copounsValidation.update, copounsService.update)
  .delete(copounsValidation.delete, copounsService.delete);

export default copounsRouter;
