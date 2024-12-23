import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

import subcategoriesSchema from "./subcategories.schema";
import { SubCategories } from "./subcategories.interface";
import crudService from "../shared/crud.service";

class SubCategoriesService {
  setCategoryId(req: Request, res: Response, next: NextFunction) {
    if (req.params.categoryId && !req.body.category)
      req.body.category = req.params.categoryId;
    next();
  }

  filterSubcategories(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req.params.categoryId) filterData.category = req.params.categoryId;
    req.filterData = filterData;
    next();
  }

  // Get all Subcategories from the database
  getAll = crudService.getAll<SubCategories>(subcategoriesSchema);

  // Get One SubCategory
  getOne = crudService.getOne<SubCategories>(subcategoriesSchema);

  // Create a new Subcategory
  create = crudService.create<SubCategories>(subcategoriesSchema);

  // update one Subcategory
  update = crudService.update<SubCategories>(subcategoriesSchema);

  // Delete one Subcategory
  delete = crudService.delete<SubCategories>(subcategoriesSchema);
  // Save Images
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const file = req.file;
      const fileName = `subcategory-${Date.now()}-${
        file.originalname.split(".")[0]
      }.webp`;

      await sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 500, height: 500 })
        .toFile(`src/uploads/images/subcategories/${fileName}`);
      req.body.image = fileName;
    }
    next();
  };
}

const subCategoriesService = new SubCategoriesService();

export default subCategoriesService;
