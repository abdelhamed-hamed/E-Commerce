import { Router } from "express";

import authService from "../auth/auth.service";
import copounsService from "./carts.service";
import copounsValidation from "./copouns.validation";

const cartsRouter: Router = Router();

cartsRouter.use(authService.protectedRoute, authService.checkActive);

cartsRouter
  .route("/")
  .get(copounsService.getAll)
  .post(copounsValidation.creat, copounsService.create);

cartsRouter
  .route("/:id")
  .get(copounsValidation.getOne, copounsService.getOne)
  .put(copounsValidation.update, copounsService.update)
  .delete(copounsValidation.delete, copounsService.delete);

export default cartsRouter;
