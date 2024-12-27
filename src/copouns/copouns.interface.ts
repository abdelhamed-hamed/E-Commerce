import { Document } from "mongoose";

export interface Copouns extends Document {
  readonly name: string;
  discount: string;
  expiredTime: Date;
}
