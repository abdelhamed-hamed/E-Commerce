import { Router } from "express";
import subCategoriesService from "./subcategories.service";
import subcategoriesService from "./subcategories.service";
import subcategoriesValidation from "./subcategories.validation";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";

const subcategoriesRouter: Router = Router({
  mergeParams: true,
});

subcategoriesRouter
  .route("/")
  .get(subcategoriesService.filterSubcategories, subCategoriesService.getAll)
  .post(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    subCategoriesService.setCategoryId,
    subcategoriesValidation.creat,
    uploadSingleFile(["image"], "image"),
    subCategoriesService.saveImage,
    subcategoriesService.setCategoryId,
    subCategoriesService.create
  );

subcategoriesRouter
  .route("/:id")
  .get(subcategoriesValidation.getOne, subCategoriesService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    subcategoriesValidation.update,
    uploadSingleFile(["image"], "image"),
    subCategoriesService.saveImage,
    subCategoriesService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    subcategoriesValidation.delete,
    subCategoriesService.delete
  );

export default subcategoriesRouter;
