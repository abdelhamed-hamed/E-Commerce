import { Router } from "express";
import ProductsService from "./products.service";
import productsValidation from "./products.validation";
import productsService from "./products.service";
import { uploadMultiFiles } from "../middlewares/uploadsFiles.middleware";
import authService from "../auth/auth.service";
import reviewsRoute from "../reviews/reviews.route";

const productsRouter: Router = Router();

productsRouter.use("/:productId/reviews", reviewsRoute);
productsRouter.get(
  "/category/:categoryId",
  productsService.filterProducts,
  productsService.getAll
);

productsRouter
  .route("/")

  .post(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadMultiFiles(
      ["image"],
      [
        { name: "cover", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]
    ),
    productsService.saveImage,
    productsValidation.creat,
    ProductsService.create
  );

productsRouter
  .route("/:id")
  .get(productsValidation.getOne, ProductsService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    uploadMultiFiles(
      ["image"],
      [
        { name: "cover", maxCount: 1 },
        { name: "images", maxCount: 5 },
      ]
    ),
    productsService.saveImage,
    productsValidation.update,
    ProductsService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    productsValidation.delete,
    ProductsService.delete
  );

export default productsRouter;
