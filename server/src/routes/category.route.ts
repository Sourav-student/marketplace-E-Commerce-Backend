import { Router } from "express";
import { authentication } from "../middlewares/authentication.middleware";
import { createCategory, deleteCategory, getAllCategory } from "../controllers/category.controller";
import { adminAuthorization } from "../middlewares/authorization.middleware";

export const categoryRouter  = Router();

categoryRouter.post('/', authentication, adminAuthorization, createCategory);
categoryRouter.get('/all', getAllCategory);
categoryRouter.delete('/delete', authentication, adminAuthorization, deleteCategory);