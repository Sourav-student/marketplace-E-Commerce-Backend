import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { createCategoryService, deleteCategoryService, getAllCategoryService } from "../services/category.service";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      message: "created new category!",
      success: true,
      data: category
    });
  }
);

export const getAllCategory = asyncHandler(
  async (req : Request, res : Response) => {
    const categories = await getAllCategoryService();

    return res.status(200).json({
      message : "fetch all categories",
      success : true,
      categories
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req : Request, res : Response) => {
    const isDelete = await deleteCategoryService(req.query.category_id as string);

    return res.status(200).json({
      message : "category deleted successfully",
      success : true
    });
  }
);