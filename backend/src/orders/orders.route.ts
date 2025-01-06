import { Router } from "express";
import authService from "../auth/auth.service";
import ordersService from "./orders.service";
import ordersValidation from "./oreders.validation";

const ordersRouter: Router = Router();

ordersRouter.use(authService.protectedRoute, authService.checkActive);

ordersRouter
  .route("/")
  .get(ordersService.filterOrders, ordersService.getAll)
  .delete(ordersService.deletAll);

ordersRouter
  .route("/:id")
  .get(ordersValidation.getOne, ordersService.getone)
  .delete(ordersValidation.deleteOne, ordersService.deleteOne);

ordersRouter
  .route("/cash-order")
  .post(ordersValidation.creatCashOrder, ordersService.creatCashOrder);

ordersRouter
  .route("/:id/pay")
  .put(authService.allowedTo("admin", "employee"), ordersService.payOrder);

ordersRouter
  .route("/:id/deliver")
  .put(authService.allowedTo("admin", "employee"), ordersService.deliverOrder);

export default ordersRouter;
