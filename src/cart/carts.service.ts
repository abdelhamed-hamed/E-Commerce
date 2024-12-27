import { Request, Response, NextFunction } from "express";
import { Carts } from "./carts.interface";
import crudService from "../shared/crud.service";
import cartsSchema from "./carts.schema";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/api-errors";

class CartsService {
  getCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user!._id });

      if (!cart) return next(new ApiErrors(req.__("empty"), 404));

      res.status(200).json({ data: cart });
    }
  );

  deleteCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user!._id });

      if (!cart) return next(new ApiErrors(req.__("empty"), 404));

      res.status(204).json({});
    }
  );
}

// Takeing Copy from the categoryService
const cartsService = new CartsService();

export default cartsService;
