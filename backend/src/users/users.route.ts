import { Router } from "express";

import usersService from "./users.service";
import usersValidation from "./users.validation";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";

const usersRoute: Router = Router();

usersRoute.use(
  authService.protectedRoute,
  authService.checkActive,
  authService.allowedTo("admin")
);

usersRoute
  .route("/")
  .get(usersService.getAll)
  .post(
    uploadSingleFile(["image"], "image"),
    usersService.saveImage,
    usersValidation.creat,
    usersService.create
  );

usersRoute
  .route("/:id")
  .get(usersValidation.getOne, usersService.getOne)
  .put(
    authService.protectedRoute,
    uploadSingleFile(["image"], "image"),
    usersService.saveImage,
    usersValidation.update,
    usersService.update
  )
  .delete(
    authService.protectedRoute,
    usersValidation.delete,
    usersService.delete
  );

// route to change password
usersRoute.put(
  "/:id/changePassword",
  authService.protectedRoute,
  usersValidation.changePassword,
  usersService.changePassword
);

export default usersRoute;
