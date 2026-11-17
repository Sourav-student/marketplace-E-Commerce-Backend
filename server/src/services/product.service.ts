import { prisma } from "../lib/prisma";
import { ProductDataType, SearchProductType } from "../types/types";
import { AppError } from "../utils/app-error";

export async function addProductService(data: ProductDataType, seller_id: string) {
   const { product_name, price, quantity, tags, category_id, image_url, category_name, description } = data;
   const tag: string[] = tags.split(',').map((t) => t.trim());

   const product = await prisma.product.create({
      data: {
         product_name, price, quantity, tag, category_id, seller_id, image_url, category_name, description
      },

      select: {
         id: true,
         seller_id: true,
         category_id: true,
         product_name: true,
         price: true,
         quantity: true,
         tag: true,
         category_name: true
      }
   });

   if (!product) {
      throw new AppError("try again later", 500);
   }

   return product;
}

/* 
  get products services
   i. All products /product/all
   ii. One product with product_id /product/:productId
   iii. All products by seller : /product?seller_id={seller_id}
*/
export async function getProductsService() {
   const products = await prisma.product.findMany();
   if (!products) {
      throw new AppError("no products found", 404);
   }
   return products;
}

export async function getProductByIdService(id: string) {
   if (id.trim() === '') {
      throw new AppError("no product_id found", 400);
   }

   const product = await prisma.product.findFirst({
      where: { id },
      select: { product_name: true, price: true, quantity: true, category_id: true, category_name: true, seller_id: true, id: true, image_url: true, description: true }
   });

   if (!product) {
      throw new AppError("no product found!", 404);
   }

   return product;
}

export async function getProductBySellerIdService(seller_id: string) {
   const products = await prisma.product.findMany({
      where: {
         seller_id: seller_id
      },
      select: {
         product_name: true,
         price: true,
         quantity: true,
         category_id: true,
         category_name: true,
         seller_id: true,
         id: true,
         image_url: true,
         description: true
      }
   });

   if (products.length === 0) {
      throw new AppError("No products found", 404);
   }

   return products;
}

/*
  update services
  i. update product quantity : /product/update/quantity?id={id}
  ii. update product name : /product/update/name?id={id}
  iii. update description : /product/update/description?id={id} 
*/
export async function updateProductQuantityService(id: string, quantity: number) {
   const updatedProduct = await prisma.product.update({
      where: { id },
      data: { quantity: quantity },
      select: { product_name: true, price: true, quantity: true, category_id: true, category_name: true, seller_id: true, id: true, image_url: true, description: true }
   });

   if (!updatedProduct) {
      throw new AppError("can't update currently");
   }

   return updatedProduct;
}

export async function updateProductNameService(id: string, name: string) {
   if (!name || name.trim() === null) {
      throw new AppError("provide a valid name!");
   }

   const updatedProduct = await prisma.product.update({
      where: { id },
      data: { product_name: name },
      select: { product_name: true, price: true, quantity: true, category_id: true, category_name: true, seller_id: true, id: true, image_url: true, description: true }
   });

   if (!updatedProduct) {
      throw new AppError("update not possible", 500);
   }

   return updatedProduct;
}

export async function updateProductDescService(id: string, description: string) {
   if (description.trim() === null) {
      throw new AppError("provide valid description");
   }

   const updatedProduct = await prisma.product.update({
      where: { id },
      data: { description: description },
      select: { product_name: true, price: true, quantity: true, category_id: true, category_name: true, seller_id: true, id: true, image_url: true, description: true }
   });

   if (!updatedProduct) throw new AppError("no update possible, try again later", 500);

   return updatedProduct;
}

/* 
delete sevices 
  i. delete by product id : /product/delete?id={id}
  ii. delete by seler id (only admin do if seller is not good) : /product/delete?seller_id={seller_id}
*/
export async function deleteByIdService(id: string) {
   const deletedProduct = await prisma.product.delete({ where: { id } });

   if (!deletedProduct) {
      throw new AppError("product not deleted! try again later", 500);
   }

   return deletedProduct;
}

export async function deleteBySellerIdService(seller_id: string) {
   const deletedProduct = await prisma.product.deleteMany({
      where: { seller_id }
   });

   if (!deletedProduct) {
      throw new AppError("can't delete products of seller");
   }

   return deletedProduct;
}

/*
   search
*/
export async function searchProductsService(data: SearchProductType) {
   const { product_name, category_id } = data;

   const products = await prisma.product.findMany({
      where: {
         ...(product_name && {
            product_name: {
               contains: product_name,
               mode: "insensitive"
            }
         }),
         ...(category_id && { category_id })
      }
   });

   if(!products){
      throw new AppError("no products found!", 404);
   }

   return products;
}