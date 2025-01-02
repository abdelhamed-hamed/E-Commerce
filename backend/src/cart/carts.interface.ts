import { Document } from "mongoose";
import { Users } from "../users/users.interface";

export interface Carts extends Document {
  items: ProductItem[];
  totalPrice: any;
  totalPriceAfterDiscount: number | undefined;
  taxPrice: any;
  user: Users;
}

export interface ProductItem {
  product: any;
  quantity: number;
  price: number;
}
