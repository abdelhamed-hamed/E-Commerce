import { Router } from "express";
import categoriesService from "./categories.service";
import categoryValidation from "./categories.validation";
import { uploadSingleFile } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";
import subcategoriesRouter from "../subcategories/subcategories.route";
import productsRouter from "../products/products.route";

const categoriesRouter: Router = Router();

// Get Subcategories by Category
categoriesRouter.use("/:categoryId/subcategories", subcategoriesRouter);

categoriesRouter
  .route("/")
  .get(categoriesService.getAll)
  .post(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadSingleFile(["image"], "image"),
    categoriesService.saveImage,
    categoryValidation.creat,
    categoriesService.create
  );

categoriesRouter
  .route("/:id")
  .get(categoryValidation.getOne, categoriesService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadSingleFile(["image"], "image"),
    categoriesService.saveImage,
    categoryValidation.update,
    categoriesService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    categoryValidation.delete,
    categoriesService.delete
  );

export default categoriesRouter;
