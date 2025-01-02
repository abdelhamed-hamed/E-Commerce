import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";

import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/api-errors";
import tokens from "../utils/creatToken";
import sanitization from "../utils/sanitization";
import sendEmail from "../utils/sendMails";

class AuthService {
  login = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const findEmailOrUserName = {
        $or: [{ username: req.body.username }, { email: req.body.email }],
      };

      //Check If User OR Email Founded Or No
      const user = await usersSchema.findOne(findEmailOrUserName);

      // بشوف هل اليوزر مش مموجود
      // هنا بشوف هل الباسوورد ال مدخله بيساوي نفس قيمة الباسوورد ال معمول ليها هاش ولا لا
      // لو مفيش يوزر او الباسووردين مش موجودين مش هيطلعلي توكين وهيدخل علي ال بعده
      if (!user || !(await bcrypt.compare(req.body.password, user.password)))
        return next(new ApiErrors(req.__("invalid-email-password"), 400));

      // لو نجح ف الاختبار اعمل لليوزر ده توكن
      const token = tokens.creatToken(user._id, user.role);

      user!.passwordResetCode = undefined;
      user!.passwordResetCodeExpires = undefined;
      user!.passwordResetCodeVerify = undefined;

      res.status(200).json({ token, data: sanitization.User(user) });
    }
  );

  adminLogin = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const findAdmin = {
        $or: [{ username: req.body.username }, { email: req.body.email }],
        role: { $in: ["admin", "employee"] },
      };

      const user = await usersSchema.findOne(findAdmin);

      if (
        !user ||
        user.hasPassword == false ||
        !(await bcrypt.compare(req.body.password, user.password))
      )
        return next(new ApiErrors(`${req.__("account-permission")}`, 400));

      const token = tokens.creatToken(user._id, user.role);
      res.status(200).json({ token, data: sanitization.User(user) });
    }
  );

  signup = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await usersSchema.create({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        image: req.body.image,
        role: req.body.role,
      });

      const token = tokens.creatToken(newUser._id, newUser.role);

      res.status(201).json({ token, data: sanitization.User(newUser) });
      next();
    }
  );

  // Start Forget Password

  // [1] - send code using nodemailer
  forgetPassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({ email: req.body.email });
      if (!user) return next(new ApiErrors(req.__("invalid-user"), 404));

      // regular code
      const codeReqular: string = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // hashing code
      const hash = crypto
        .createHash("sha256")
        .update(codeReqular)
        .digest("hex")
        .toString();

      // Message Options
      const option = {
        email: req.body.email,
        subject: "Reset-Password",
        message: `Reset Code Is ${codeReqular}`,
      };

      // Send Mail And Change Some Prperties in interface
      try {
        await sendEmail(option);
        user.passwordResetCode = hash;
        user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
        user.passwordResetCodeVerify = false;

        // عشان لما اعمل حفظ المفروض هيضيف اللينك قبل الصوره
        // فهنا بقوله قص اسم الصوره قبل الحفظ عشان خاطر لما تضيف اللينك تبقي تمام
        if (user.image && user.image.startsWith(process.env.BASE_URL!))
          user.image = user.image.split("/").pop()!;

        // Save Changed Data Only
        await user.save({ validateModifiedOnly: true });
      } catch (e) {
        console.log(e);
        return next(new ApiErrors(req.__("server"), 500));
      }

      // Create Token for 10 minutes to know user
      const token = tokens.PasswordToken(user._id);

      res.status(200).json({ token, success: true });
    }
  );

  // [2] - check code correct or no
  verifyCode = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token = "";

      // Check If Send Token In header
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      // Not Send Token
      else return next(new ApiErrors(req.__("account-permission"), 403));

      // Check If Token Valid OR NO
      const decode: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY_RESET_PASSWORD!
      );

      // Hash Code User sending in body
      const hash = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex")
        .toString();

      // Find User
      const user = await usersSchema.findOne({
        _id: decode._id,
        passwordResetCode: hash,
        passwordResetCodeVerify: false,
        passwordResetCodeExpires: { $gt: Date.now() },
      });

      if (!user) return next(new ApiErrors(req.__("invalid-user"), 404));

      // Make Verify Password Equal True
      user.passwordResetCodeVerify = true;

      if (user.image && user.image.startsWith(process.env.BASE_URL!))
        user.image = user.image.split("/").pop()!;

      // Save Changed Data Only
      await user.save({ validateModifiedOnly: true });

      res.status(200).json({ success: true });
    }
  );

  // [3] - change password
  resetPassword = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token = "";

      // Check If Send Token In header
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      // Not Send Token
      else return next(new ApiErrors(req.__("account-permission"), 403));

      // Check If Token Valid OR NO
      const decode: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY_RESET_PASSWORD!
      );

      // انا مبحثتش بال باسوورد اكسبير هنا عشان التوكن اصلا مدته عشر دقايق
      const user = await usersSchema.findOne({
        _id: decode._id,
        passwordResetCodeVerify: true,
      });

      if (!user) return next(new ApiErrors(req.__("invalid-user"), 404));

      // هنا معملتش الباسوورد بالكريبت لانه عامل لو عملت سيف يحفظه تلقائي
      user.password = req.body.password;

      // Change All Thing Of Resete Code
      user.passwordResetCode = undefined;
      user.passwordResetCodeExpires = undefined;
      user.passwordResetCodeVerify = undefined;
      user.passwordChangedAt = Date.now();

      if (user.image && user.image.startsWith(`${process.env.BASE_URL}`))
        user.image = user.image.split("/").pop()!;
      await user.save({ validateModifiedOnly: true });

      res.status(200).json({ success: true });
    }
  );

  protectedRoute = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // [1] - get token
      let token = "";

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      } else {
        return next(new ApiErrors(req.__("please-login"), 401));
      }

      // [2] - decoded token
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET_KEY!);

      // [3] - check token still connected in DB or expired
      const user = await usersSchema.findById(decodedToken._id);

      if (!user) {
        return next(new ApiErrors(req.__("invalid-user"), 404));
      }

      // [3] - check change password

      // Check If changed password or no
      if (user.passwordChangedAt instanceof Date) {
        // transfer passwordchangedat
        const chagedPasswordSeconed: number = parseInt(
          (user.passwordChangedAt.getTime() / 1000).toString()
        );

        // if password changedat after transfer larger than token creat
        if (chagedPasswordSeconed > decodedToken.iat) {
          return next(new ApiErrors(req.__("please-login"), 401));
        }
      }

      // [4] storage user in request
      req.user = user;
      next();
    }
  );

  checkActive = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.active) {
        return next(new ApiErrors(req.__("account-activate"), 403));
      }
      next();
    }
  );

  allowedTo = (...roles: string[]) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role!)) {
          return next(new ApiErrors(req.__("account-permission"), 403));
        }
        next();
      }
    );
}

const authService = new AuthService();
export default authService;
