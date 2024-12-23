import { Router } from "express";
import authService from "../auth/auth.service";
import reviewsService from "./reviews.service";

const reviewsRoute: Router = Router();

reviewsRoute.route("/").get(reviewsService.getAll).post(
  authService.protectedRoute,
  authService.checkActive,

  reviewsService.create
);

reviewsRoute
  .route("/:id")
  .get(reviewsService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    reviewsService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    reviewsService.delete
  );

export default reviewsRoute;
