import { Router } from "express";

import authService from "../auth/auth.service";
import cartsService from "./carts.service";
import cartsValidation from "./carts.validation";

const cartsRouter: Router = Router();

cartsRouter.use(
  authService.protectedRoute,
  authService.checkActive,
  authService.allowedTo("user")
);

cartsRouter
  .route("/my-cart")
  .get(
    cartsService.setUserIdInParams,
    cartsValidation.getCart,
    cartsService.getCart
  )
  .delete(
    cartsService.setUserIdInParams,
    cartsValidation.deleteCart,
    cartsService.deleteCart
  );

cartsRouter
  .route("/add-to-cart")
  .post(cartsValidation.addToCart, cartsService.addToCart);

cartsRouter
  .route("/update-remove-product/:itemId")
  .delete(cartsValidation.removeProduct, cartsService.removeProductFromCart)
  .put(cartsValidation.UpdateQuantity, cartsService.updateProductQuantity);

cartsRouter
  .route("/apply-coupoun")
  .put(cartsValidation.applyCoupoun, cartsService.applyCoupoun);

cartsRouter.route("/:id").get().put().delete();

export default cartsRouter;
