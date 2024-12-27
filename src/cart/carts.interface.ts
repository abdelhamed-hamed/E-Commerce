import { Document } from "mongoose";
import { Products } from "../products/products.interface";
import { Users } from "../users/users.interface";

export interface Carts extends Document {
  items: ProductItem[];
  totalPrice: number;
  totalPriceAfterDiscount: number;
  user: Users;
}

export interface ProductItem {
  product: Products;
  quantity: number;
  price: number;
}
