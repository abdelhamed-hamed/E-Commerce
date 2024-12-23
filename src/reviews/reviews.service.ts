import { Request, Response, NextFunction } from "express";

import { Reviews } from "./reviews.interface";
import crudService from "../shared/crud.service";
import reviewsSchema from "./reviews.schema";

class ReviewsService {
  getAll = crudService.getAll<Reviews>(reviewsSchema);

  getOne = crudService.getOne<Reviews>(reviewsSchema);

  create = crudService.create<Reviews>(reviewsSchema);

  update = crudService.update<Reviews>(reviewsSchema);

  delete = crudService.delete<Reviews>(reviewsSchema);
}

const reviewsService = new ReviewsService();

export default reviewsService;
