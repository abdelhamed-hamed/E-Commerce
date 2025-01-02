import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

import crudService from "../shared/crud.service";
import { Products } from "./products.interface";
import productsSchema from "./products.schema";
import expressAsyncHandler from "express-async-handler";
import Features from "../utils/features";

// Service for Products CRUD operations
class ProductsService {
  filterProducts(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req.params.categoryId) filterData.category = req.params.categoryId;
    req.filterData = filterData;
    next();
  }
  // Get all Products from the database
  getAll = crudService.getAll<Products>(productsSchema);
  // Get One Product
  getOne = crudService.getOne<Products>(productsSchema, "products", "reviews");

  // Create a new Product
  create = crudService.create<Products>(productsSchema);

  // update one Product
  update = crudService.update<Products>(productsSchema);

  // Delete one Product
  delete = crudService.delete<Products>(productsSchema);

  // Save Images
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.files) {
      if (req.files.cover) {
        const file = req.files.cover[0];
        const fileName = `product-${Date.now()}-${
          file.originalname.split(".")[0]
        }-cover.webp`;

        await sharp(file.buffer)
          .webp({ quality: 90 })
          .resize({ width: 500, height: 500 })
          .toFile(`src/uploads/images/products/${fileName}`);
        req.body.cover = fileName;
      }

      // مش شر\ يكون اسمها ايمجس حسب انا باعت اي في ال بادي لو باعت فولدرات مثلا هعمل بدل ايمجس فولدرز
      if (req.files.images) {
        // // دي عشان اعمل بوش فيها وتنضاف قيمة الصور من ال ارااي الجديده بتاعت الماب وبعد كدا بببعتها للبودي ال اسمه ايمجس
        // //  حطتها برا خالص بحيث ابعتها اول متتملي جوا البروميس ويخلص للبودي
        const allImages: string[] = [];

        // // لازم اعمل برومسيس لكل حاجه لو انا برجع داتا من ال اي بي اي في ارراي ومحتاجه تحميل
        // // السبب عشان لو معملتش كدا هياخد اول عنصر ويطلع برا ال ارااي
        await Promise.all(
          // ال ماب عشان ارجع ارراي جديده فيها القيم ال خدتها من اليوزر عشان اخزنها في الداتا بيز
          req.files.images.map((image: any, index: number) => {
            const fileName = `product-${Date.now()}-${
              image.originalname.split(".")[0]
            }-image-number-[${index + 1}].webp`;

            sharp(image.buffer)
              .webp({ quality: 90 })
              .resize({ width: 500, height: 500 })
              .toFile(`src/uploads/images/products/${fileName}`);

            allImages.push(fileName);
          })
        );
        req.body.images = allImages;

        // Another Solution But Less Performance
        // Loop In All Image
        // for (let image of req.files.images) {
        //   let i = 0;
        //   const fileName = `product-${Date.now()}-${
        //     image.originalname.split(".")[0]
        //   }-image-number-[${i + 1}].webp`;

        //   sharp(image.buffer)
        //     .webp({ quality: 90 })
        //     .resize({ width: 500, height: 500 })
        //     .toFile(`src/uploads/images/products/${fileName}`);
        //   allImages.push(fileName);
        //   i++;
        // }
        // Send Images Name To Body
        // req.body.images = allImages;
      }
    }
    next();
  };
}
// Takeing Copy from the categoryService
const productsService = new ProductsService();

// Exporting the ProductsService copied from the categoryService Class
export default productsService;
