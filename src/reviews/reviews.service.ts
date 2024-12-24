import { Request, Response, NextFunction } from "express";

import { Reviews } from "./reviews.interface";
import crudService from "../shared/crud.service";
import reviewsSchema from "./reviews.schema";

class ReviewsService {
  // دي فايدتها مش بتخليني ادخل اي يوزر في ال بودي واخليه يعمل كومنت لا اليوزر المسجل فقط
  // دي بتخليني بردو اعمل حاجه تانيه وهي اني معملش الريفيو غير علي ال بروداكت ال داخله في الراوت فقط
  setIdProductAndUSer(req: Request, res: Response, next: NextFunction) {
    // دي بعملها بحيث ان لما اجي من منتج معين وال اي دي في الصفحة فوق اخزنه في ال بودي بتاعه تلقائي
    req.body.product = req.params.productId;
    req.body.user = req.user?._id;
    next();
  }

  // دي بتخليني افلتر الداتا بحيث ال يوزر يقدر يحصل علي كومنتات بتعته علي كل البوستات
  // الفرق بينها وبين الجيت الل العاديه عشان العاديه هترجع كل الكومنت علي بوست محدد لكن دي هترجع كل الكومنت ولكن الخاصه بيا اليوزر المسحل

  getMyCommentByFilter(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    // لو في بارمز باسم برودكت اي دي معناها ان جاي دايركت من منتج فهاتلي كل التعليقات علي المنتج دا
    if (req.params.productId) filterData.product = req.params.productId;

    // لو مفيش اي دي للمنتج معناها ان عايز كل الريفيوز لليوزر المحدد ده فقط
    // فايدة ال رول عشان مفيش ادمن يقدر يعمل ريفيو
    if (!req.params.productId && req.user && req.user.role === "user")
      filterData.user = req.user?._id;

    // هنا ببعت القيمة ال هيبحث بيها للفلتر داتا ال موجوده في الكراد سيرفيس
    req.filterData = filterData;
    next();
  }

  getAll = crudService.getAll<Reviews>(reviewsSchema);

  getOne = crudService.getOne<Reviews>(reviewsSchema);

  create = crudService.create<Reviews>(reviewsSchema);

  update = crudService.update<Reviews>(reviewsSchema);

  delete = crudService.delete<Reviews>(reviewsSchema);
}

const reviewsService = new ReviewsService();

export default reviewsService;
