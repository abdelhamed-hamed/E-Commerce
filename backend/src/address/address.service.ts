import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/api-errors";

class AddressService {
  getAddress = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User address
      const user = await usersSchema.findById(req.user?._id);

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      res.status(200).json({
        length: user?.address.length,
        data: user?.address,
      });
    }
  );

  addAddress = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User And Add Product To Addrss
      const user = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          $addToSet: { address: req.body.address },
        },
        { new: true }
      );

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      res.status(200).json({
        length: user?.address.length,
        data: user?.address,
      });
    }
  );

  deleteAddress = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //   Find User And Delete Product To address
      const user = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          $pull: { address: { _id: req.params.addressId } },
        },
        { new: true }
      );

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      res.status(200).json({
        length: user?.address.length,
        data: user?.address,
      });
    }
  );
}
const addressService = new AddressService();
export default addressService;
