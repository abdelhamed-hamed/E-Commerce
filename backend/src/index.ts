import express from "express";

import ApiErrors from "./utils/api-errors";
import globalErrors from "./middlewares/errors.middlewares";

import subcategoriesRouter from "./subcategories/subcategories.route";
import categoriesRouter from "./categories/categories.route";
import productsRoute from "./products/products.route";
import usersRoute from "./users/users.route";
import authRoute from "./auth/auth.route";
import { Users } from "./users/users.interface";
import profileRoute from "./profile/profile.route";
import googleRoute from "./google/google.route";
import wishlistRoute from "./wishlist/wishlist.route";
import addressRoute from "./address/address.route";
import reviewsRoute from "./reviews/reviews.route";
import copounsRoute from "./copouns/copouns.route";
import cartsRouter from "./cart/carts.route";

// Edit Express Request
declare module "express" {
  interface Request {
    filterData?: any;
    files?: any;
    user?: Users;
  }
}

const mainRoutes = (app: express.Application) => {
  app.use("/auth/google", googleRoute);
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRouter);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/users", usersRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/profile", profileRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/copouns", copounsRoute);
  app.use("/api/v1/carts", cartsRouter);

  //  Handle Routes Error
  app.all(
    "*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      next(new ApiErrors(`route ${req.originalUrl} not-found`, 400));
    }
  );

  // Show Error in json
  app.use(globalErrors);
};

export default mainRoutes;
