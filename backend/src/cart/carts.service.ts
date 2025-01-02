import { Request, Response, NextFunction } from "express";
import { Carts, ProductItem } from "./carts.interface";
import cartsSchema from "./carts.schema";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/api-errors";
import productsSchema from "../products/products.schema";
import copounsSchema from "../copouns/copouns.schema";

class CartsService {
  setUserIdInParams(req: Request, res: Response, next: NextFunction) {
    let userIsd: any = req.user!._id;
    req.params.userId = userIsd;
    next();
  }

  getCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user!._id });

      if (!cart) return next(new ApiErrors(req.__("empty"), 404));

      res.status(200).json({ length: cart.items.length, data: cart });
    }
  );

  deleteCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOneAndDelete({ user: req.user!._id });

      if (!cart) return next(new ApiErrors(req.__("empty"), 404));

      res.status(204).json({});
    }
  );

  addToCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const product = await productsSchema.findById(req.body.product);
      if (!product) return next(new ApiErrors(req.__("not-found"), 404));

      let cart: Carts | null = await cartsSchema.findOne({
        user: req.user!._id,
      });

      if (!cart) {
        cart = await cartsSchema.create({
          user: req.user!._id,

          items: {
            product: product?._id,

            quantity: req.body.quantity,

            price: product!.priceAfterDiscount
              ? product!.priceAfterDiscount
              : product!.price,
          },
        });
      } else {
        // Check If Product In Cart OR No
        const findProductIndex: number = cart.items.findIndex(
          (item: ProductItem) =>
            product?._id!.toString() == item.product._id.toString()
        );

        // If Product Founded In Cart
        if (findProductIndex > -1) {
          cart.items[findProductIndex].quantity = req.body.quantity
            ? parseInt(req.body.quantity) +
              cart.items[findProductIndex].quantity
            : ++cart.items[findProductIndex].quantity;
        }

        // If Not Founded
        else {
          // push product in cart in items
          cart.items.push({
            product: product!._id,

            quantity: req.body.quantity,

            price: product!.priceAfterDiscount
              ? product!.priceAfterDiscount
              : product!.price,
          });
        }
      }

      this.calcTotalPrice(cart);
      await cart?.save();

      res.status(200).json({ length: cart?.items.length, data: cart });
    }
  );

  removeProductFromCart = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // انا مش محتاج المنتج هنا لان اليوزر هيبقي قدامه الكارت بتعته وكل كارت هيبقي فيها العناصر
      // انا لما اضغط علي العنصر هحدد ال اي دي وابعته في البارامز عشان امسحه فمش محتاج ال بروداكت
      const cart = await cartsSchema.findOneAndUpdate(
        { user: req.user!._id },
        // عملت ال بول عشان خاطر لو لفته موجود تحذفه لو ملقتش تعتبره مش موجود
        {
          // استعملت ال اي دي عشان زي متفقنا لو لقيت لو عملت اوبجكت جوا ارراي بتعمل لكل اوبجكت اي دي مميز
          // بعتهولو في ال بارام عشان اتفقنا بدل ابديت فببعت في ال بارمز
          $pull: { items: { _id: req.params.itemId } },
        }
      );

      if (!cart) return next(new ApiErrors(req.__("not-found"), 404));

      this.calcTotalPrice(cart);
      await cart.save();

      res.status(200).json({ length: cart?.items.length, data: cart });
    }
  );

  updateProductQuantity = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user!._id });
      if (!cart) return next(new ApiErrors(req.__("not-found"), 404));

      const findProductIndex: number = cart.items.findIndex(
        (item: any) => item._id.toString() === req.params?.itemId.toString()
      );

      if (findProductIndex > -1) {
        cart.items[findProductIndex].quantity = req.body.quantity;
      } else {
        return next(new ApiErrors(req.__("not-found"), 404));
      }

      this.calcTotalPrice(cart);
      await cart.save();

      res.status(200).json({ length: cart?.items.length, data: cart });
    }
  );

  applyCoupoun = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const coupoun = await copounsSchema.findOne({
        _id: req.body.coupoun,
        expiredTime: { $gt: Date.now() },
      });
      if (!coupoun) return next(new ApiErrors(req.__("not-found"), 404));

      const cart = await cartsSchema.findOne({ user: req.user!._id });
      if (!cart) return next(new ApiErrors(req.__("not-found"), 404));

      // Calc Price After Discount
      let totalPriceAfterDiscount: any = (
        cart.totalPrice -
        cart.totalPrice * (coupoun.discount / 100)
      ).toFixed(2);

      cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

      cart!.taxPrice = totalPriceAfterDiscount * 0.05;

      await cart?.save();

      res.status(200).json({ length: cart?.items.length, data: cart });
    }
  );

  // TO Calc Total Pricee
  calcTotalPrice(cart: Carts | null) {
    let totalPrice: number = 0;

    // CAlc Total Price All item calc Price In Quantity And Store In Total Price
    cart?.items.forEach(
      (item: ProductItem) => (totalPrice += item.price * item.quantity)
    );

    cart!.totalPrice = totalPrice.toFixed(2);
    cart!.taxPrice = totalPrice * 0.05;
    cart!.totalPriceAfterDiscount = undefined;
  }
}

// Takeing Copy from the categoryService
const cartsService = new CartsService();

export default cartsService;
