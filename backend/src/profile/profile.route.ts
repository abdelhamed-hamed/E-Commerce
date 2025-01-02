import { Router } from "express";

import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";
import profileService from "./profile.service";
import profileValidation from "./profile.validation";

const profileRoute: Router = Router();

profileRoute.use(authService.protectedRoute, authService.checkActive);

profileRoute
  .route("/")
  .get(profileService.setUserId, profileService.getOne)
  .put(
    profileService.setUserId,
    uploadSingleFile(["image"], "image"),
    profileService.saveImage,
    profileValidation.update,
    profileService.update
  )
  .delete(
    profileService.setUserId,
    profileValidation.delete,
    profileService.delete
  );

// route to change password
profileRoute.put(
  "/change-password",
  profileService.setUserId,
  profileValidation.changePassword,
  profileService.changePassword
);

// route to Create password
profileRoute.put(
  "/create-password",
  profileService.setUserId,
  profileValidation.creatPassword,
  profileService.creatPasswored
);

export default profileRoute;
