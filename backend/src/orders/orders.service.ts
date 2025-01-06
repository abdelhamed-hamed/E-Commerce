import { Request, Response, NextFunction } from "express";
import crudService from "../shared/crud.service";
import { Orders } from "./orders.interface";
import ordersSchema from "./orders.schema";
import expressAsyncHandler from "express-async-handler";
import cartsSchema from "../cart/carts.schema";
import ApiErrors from "../utils/api-errors";
import productsSchema from "../products/products.schema";

class OrdersService {
  filterOrders(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req?.user!.role === "user") filterData.user = req?.user._id;
    req.filterData = filterData;
    next();
  }

  getAll = crudService.getAll<Orders>(ordersSchema);
  getone = crudService.getOne<Orders>(ordersSchema);
  deleteOne = crudService.delete<Orders>(ordersSchema);
  deletAll = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const deleteAll = await ordersSchema.findOneAndDelete({
        user: req?.user!._id,
      });

      if (!deleteAll) return next(new ApiErrors(req.__("not-found"), 404));
      res.status(204).json();
    }
  );
  creatCashOrder = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req?.user!._id });
      if (!cart) return next(new ApiErrors(req.__("not-found"), 404));

      // بقوله لو في سعر تخفيض اجيبه بدل التوتال
      // دا سعر ال ايتيمز برايز
      const itemsPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;

      const order = await ordersSchema.create({
        user: req.user?._id,
        items: cart.items,
        itemsPrice: itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.taxPrice + itemsPrice,
        address: req.body.address,
      });

      // هنا بجهز ال بالك عشان استخدمها في البالك رايت
      // دي  فايدتها عشان اجهز الارراي
      const bulkOption = cart.items.map((item: any) => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $inc: { quantity: -item.quantity, sold: item.quantity },
          },
        },
      }));

      await productsSchema.bulkWrite(bulkOption);
      // خلاص بعد مالاوردر تم بمسح ال كارت
      await cartsSchema.deleteOne({ user: req?.user!._id });
      res.status(200).json({ data: order });
    }
  );

  // الاتنين دول خاصين بالادمن عشان لما الاوردر يدفع او يوصل يتسجل علي السيستم
  payOrder = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isPaid: true,
          paidAt: Date.now(),
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    }
  );

  deliverOrder = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isDelivered: true,
          deliveredAt: Date.now(),
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    }
  );
  // لحد هنا ##################
}

// Takeing Copy from the categoryService
const ordersService = new OrdersService();

export default ordersService;
