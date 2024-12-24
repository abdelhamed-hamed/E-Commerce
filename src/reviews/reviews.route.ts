import { Router } from "express";
import authService from "../auth/auth.service";
import reviewsService from "./reviews.service";
import reviewsValidation from "./reviews.validation";

const reviewsRoute: Router = Router({ mergeParams: true });

reviewsRoute
  .route("/")
  .get(reviewsService.getMyCommentByFilter, reviewsService.getAll)
  .post(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("user"),
    // دي الاول عشان ابعت ال اي دي في ال بادي وبعد كدا اعمل شيك عليه
    reviewsService.setIdProductAndUSer,
    reviewsValidation.creat,
    reviewsService.create
  );

// دي عشان اقدر اجيب الريفيوز الخاصه باليوزر المحدد فقط بمعني عبدالحميد مثلا كل الريفيوز بتعته
reviewsRoute
  .route("/my")
  .get(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("user"),
    reviewsService.getMyCommentByFilter,
    reviewsService.getAll
  );

reviewsRoute
  .route("/:id")
  .get(reviewsService.getOne)
  .put(
    authService.protectedRoute,
    authService.checkActive,
    reviewsValidation.update,
    reviewsService.update
  )
  .delete(
    authService.protectedRoute,
    authService.checkActive,
    authService.allowedTo("user", "admin", "employee"),
    reviewsValidation.delete,
    reviewsService.delete
  );

export default reviewsRoute;
