import { Document } from "mongoose";
import { Users } from "../users/users.interface";
import { ProductItem } from "../cart/carts.interface";

export interface Orders extends Document {
  user: Users;
  items: ProductItem[];
  itemsPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  address: Address;
  payment: string;
}

type Address = {
  street: string;
  city: string;
  zip: string;
  specialMark: string;
};
