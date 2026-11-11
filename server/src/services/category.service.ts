import { prisma } from "../lib/prisma";
import { CategoryDataType } from "../types/types";
import { AppError } from "../utils/app-error";

export async function createCategoryService(data : CategoryDataType){
    const {category_name} = data;

    const category = await prisma.category.create({
      data : {
        category_name : category_name
      }
    })

    if(!category){
      throw new AppError("cann't create new category", 500);
    }

    return category;
}

export async function getAllCategoryService(){
  const categories = await prisma.category.findMany();
  if(!categories){
    throw new AppError("no category found", 500);
  }
  
  return categories;
}

export async function deleteCategoryService(category_id : string){
  const deletedCategory = await prisma.category.delete({
    where : {id : category_id}
  });

  if(!deletedCategory){
    throw new AppError("cann't delete the category", 500);
  }

  return deletedCategory;
}