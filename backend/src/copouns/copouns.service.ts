import { Copouns } from "./copouns.interface";
import copounsSchema from "./copouns.schema";
import crudService from "../shared/crud.service";

class CopounsService {
  getAll = crudService.getAll<Copouns>(copounsSchema);

  getOne = crudService.getOne<Copouns>(copounsSchema);

  create = crudService.create<Copouns>(copounsSchema);

  update = crudService.update<Copouns>(copounsSchema);

  delete = crudService.delete<Copouns>(copounsSchema);
}

// Takeing Copy from the categoryService
const copounsService = new CopounsService();

export default copounsService;
