import { Document } from "mongoose";

export interface Copouns extends Document {
  readonly name: string;
  discount: number;
  expiredTime: Date;
}
