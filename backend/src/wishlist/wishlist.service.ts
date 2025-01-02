import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/api-errors";

class WishListService {
  getWithList = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User Wishlist
      const user = await usersSchema
        .findById(req.user?._id)
        .populate("wishlist");

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      res.status(200).json({
        length: user?.wishlist.length,
        data: user?.wishlist,
      });
    }
  );

  addToWithList = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User And Add Product To Wishlist
      const user = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          $addToSet: { wishlist: req.body.productId },
        },
        { new: true }
      );

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      await user.populate("wishlist");

      res.status(200).json({
        length: user?.wishlist.length,
        data: user?.wishlist,
      });
    }
  );

  deleteFromWithList = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User And Delete Product To Wishlist
      const user = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          $pull: { wishlist: req.params.productId },
        },
        { new: true }
      );

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      await user.populate("wishlist");

      res.status(200).json({
        length: user?.wishlist.length,
        data: user?.wishlist,
      });
    }
  );
}
const wishListService = new WishListService();
export default wishListService;
