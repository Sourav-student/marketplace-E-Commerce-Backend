import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { addProductService, getProductByIdService, getProductBySellerIdService, getProductsService, searchProductsService, updateProductDescService, updateProductNameService, updateProductQuantityService } from "../services/product.service";
import { SearchProductType } from "../types/types";

export const addProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await addProductService(req.body, res.locals.user.id);

    return res.status(201).json({
      message: "add new product",
      success: true,
      data: product
    })
  }
);

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await getProductsService();

    return res.status(200).json({
      message: "fetch all products",
      success: true,
      data: products
    });
  }
);

export const getOneProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId as string);

    return res.status(200).json({
      message: "fetch the product",
      success: true,
      data: product
    });
  }
);

export const getProductsBySellerId = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await getProductBySellerIdService(req.query.seller_id as string);

    return res.status(200).json({
      message: "fetch all products by the seller",
      success: true,
      data: products
    });
  }
);

export const updateProductName = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await updateProductNameService(req.query.product_id as string, req.body.product_name);

    return res.status(200).json({
      message: `update product with the product_id : ${req.query.productId}`,
      success: true,
      data: product
    });
  }
);

export const updateProductDesc = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await updateProductDescService(req.query.product_id as string, req.body.description);

    return res.status(200).json({
      message: "update product description",
      success: true,
      data: product
    });
  }
);

export const updateProductQuantity = asyncHandler(
  async (req : Request, res : Response) => {
    const product = await updateProductQuantityService(req.query.product_id as string, req.body.quantity);

    return res.status(200).json({
      message : "updated product quantity!",
      success : true,
      data : product
    });
  }
);

//SEARCH
export const searchProduct = asyncHandler(
  async (req : Request, res : Response) => {
    const products = await searchProductsService(req.query as SearchProductType);

    return res.status(200).json({
      message : "search successfully!",
      success : true,
      data : products
    });
  }
);