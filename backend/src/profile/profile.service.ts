import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcrypt";
import crudService from "../shared/crud.service";
import ApiErrors from "../utils/api-errors";
import { Users } from "../users/users.interface";
import usersSchema from "../users/users.schema";
import tokens from "../utils/creatToken";
import sanitization from "../utils/sanitization";

class ProfileService {
  setUserId = (req: Request, res: Response, next: NextFunction) => {
    const parmsId: any = req.user?._id;
    req.params.id = parmsId;
    next();
  };

  getOne = crudService.getOne<Users>(usersSchema, "users");

  update = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string | null = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          name: req.body.name,
          image: req.body.image,
        },
        {
          new: true,
        }
      );
      if (!user) return next(new ApiErrors(req.__("not-found"), 404));
      res.status(200).json({ data: sanitization.User(user) });
    }
  );

  delete = crudService.delete<Users>(usersSchema);

  changePassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: string | null = await usersSchema.findByIdAndUpdate(
        req.user?._id,
        {
          password: await bcrypt.hash(req.body.password, 13),
          passwordChangedAt: Date.now(),
        },
        {
          new: true,
        }
      );
      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      // دي عشان خاطر انا عايزه يفضل فاتح لما يغير الباسوورد مش يسجل خروج
      const token = tokens.creatToken(req.user?._id, req.user?.role!);

      res.status(200).json({ token, data: sanitization.User(user) });
    }
  );

  // If He sign from google
  creatPasswored = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // عملت هنا فايند وان مش اي دي عشان اشوف هل هو هاز باسوورد ولا لا عشان متبقاش ثغرة للهكر
      const query = {
        _id: req.user?._id,
        hasPassword: false,
      };

      const user = usersSchema.findOneAndUpdate(
        query,
        {
          password: await bcrypt.hash(req.body.password, 13),
        },
        { new: true }
      );

      if (!user) return next(new ApiErrors(req.__("not-found"), 404));

      res.status(200).json({ data: sanitization.User(user) });
    }
  );

  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const file = req.file;
      const fileName = `user-${Date.now()}-${
        file.originalname.split(".")[0]
      }.webp`;

      await sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 500, height: 500 })
        .toFile(`src/uploads/images/users/${fileName}`);
      req.body.image = fileName;
    }

    next();
  };
}

// Hash paswword If Click Save

const profileService = new ProfileService();

export default profileService;
