import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

import categoriesSchema from "./categories.schema";
import { Categories } from "./categories.interface";
import crudService from "../shared/crud.service";
// Service for Categories CRUD operations
class CategoriesService {
  // Get all categories from the database
  getAll = crudService.getAll<Categories>(categoriesSchema);

  // Get One Category
  getOne = crudService.getOne<Categories>(categoriesSchema);

  // Create a new category
  create = crudService.create<Categories>(categoriesSchema);

  // update one category
  update = crudService.update<Categories>(categoriesSchema);

  // Delete one category
  delete = crudService.delete<Categories>(categoriesSchema);
  // Save Images
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const file = req.file;
      const fileName = `category-${Date.now()}-${
        file.originalname.split(".")[0]
      }.webp`;

      await sharp(file.buffer)
        .webp({ quality: 90 })
        .resize({ width: 500, height: 500 })
        .toFile(`src/uploads/images/categories/${fileName}`);
      req.body.image = fileName;
    }
    next();
  };
}

// Takeing Copy from the categoryService
const categoriesService = new CategoriesService();

// Exporting the categoriesService copied from the categoryService Class
export default categoriesService;
