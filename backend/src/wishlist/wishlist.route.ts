import { Router } from "express";
import wishListService from "./wishlist.service";
import wishlistValidation from "./withlis.validation";
import authService from "../auth/auth.service";

const wishlistRoute: Router = Router();

wishlistRoute.use(authService.protectedRoute, authService.checkActive);
wishlistRoute
  .route("/")
  .get(wishListService.getWithList)
  .post(wishlistValidation.addToWishlist, wishListService.addToWithList);

wishlistRoute.delete(
  "/:productId",
  wishlistValidation.deleteFromWishlist,
  wishListService.deleteFromWithList 
);
export default wishlistRoute;
