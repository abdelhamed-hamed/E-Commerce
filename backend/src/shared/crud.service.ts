import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import ApiErrors from "../utils/api-errors";
import Features from "../utils/features";
import sanitization from "../utils/sanitization";
// Service for Categories CRUD operations
class CrudService {
  // Get all
  getAll = <T>(schema: mongoose.Model<any>, modelName?: string) =>
    expressAsyncHandler(async (req: Request, res: Response) => {
      let filterData: any = {};

      if (req.filterData) filterData = req.filterData;
      let documentsCount: any = schema.find(filterData);

      const features = new Features(schema.find(filterData), req.query)
        .filter()
        .sort()
        .limitFields()
        .search(modelName!);

      const { mongooseQuery } = features;

      const documents: T[] = await mongooseQuery;

      // دي عشان خاطر لو عملت اي قيوتشر يخليلي الداتا بتعتي دي في الاةل كانها اول عنصر في العمليات ال تمت
      //بمعني لو انا عملت بحث وطلعلي نتيجتين يخلي اول منتج دا كانه اول عنصر في ال ارراي معايا وال بعديه يبقي رقم 2 وهكذا كانهم ارراي منفصله
      // دا عشان ميجبش ترتيبهم من الداتا  بيز فلو هو 100 يخليني 100 لا دي لو هو 100 يخليه رقم واحد كانها داتا لوحدها

      if (req.query) {
        documentsCount = documents.length;
      }

      await features.pagination(documentsCount);
      const { paginationResult } = features;

      res.status(200).json({
        pagination: paginationResult,
        length: documents.length,
        data: documents,
      });
    });

  // Get One
  // فايدة الموديل نيم عشان خاطر لو عامل يوزر  في ال جيت ميرجعوش بالداتا الحساسه واعمله سنتيزيشن الاول
  getOne = <T>(
    scheme: mongoose.Model<any>,
    modelName?: string,
    populationOption?: string
  ) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        // دا متغير بعمل كل ال عايزها
        let query = scheme.findById(req.params.id);
        // لو في اي قيمة خلي ال كيري يتعمل عليها بوبيوليت الاول
        if (populationOption) query = query.populate(populationOption);
        // بساوي قيمتها بقيمة الحاجه ال عملت العمليات عليها
        let document: any = await query;
        if (!document) return next(new ApiErrors(req.__("not-found"), 404));

        // هنا بقوله لو ال جايلك حاجه بروفايل اعملي سنتيزيشن للداتا
        if (modelName == "users") document = sanitization.User(document);
        res.status(200).json({ data: document });
      }
    );

  // Create a new
  create = <T>(scheme: mongoose.Model<any>) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const document: T = await scheme.create(req.body);
        res.status(201).json({ data: document });
      }
    );

  // update one
  update = <T>(scheme: mongoose.Model<any>) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const updateDocument: T | null = await scheme.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        if (!updateDocument)
          return next(new ApiErrors(req.__("not-found"), 404));
        res.status(200).json({ data: updateDocument });
      }
    );

  // Delete one
  delete = <T>(scheme: mongoose.Model<any>) =>
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const deleteDocument: T | null = await scheme.findByIdAndDelete(
          req.params.id
        );
        if (!deleteDocument)
          return next(new ApiErrors(req.__("not-found"), 404));
        res.status(204).json();
      }
    );
}

// Takeing Copy from the crudService
const crudService = new CrudService();

// Exporting the crudService copied from the CrudService Class
export default crudService;
