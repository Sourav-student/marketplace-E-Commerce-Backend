import { Router } from "express";
import { authentication } from "../middlewares/authentication.middleware";
import { adminAuthorization, sellerAuthorization } from "../middlewares/authorization.middleware";
import { addProduct, getAllProducts, getOneProductById, getProductsBySellerId, searchProduct, updateProductDesc, updateProductName, updateProductQuantity } from "../controllers/product.controller";

export const productRouter = Router();

productRouter.post('/product', authentication, adminAuthorization, addProduct);

//GET REQUESTs
productRouter.get('/product/all', getAllProducts);
productRouter.get('/product/productId/:productId', authentication, getOneProductById);
productRouter.get('/product', authentication, getProductsBySellerId);

//UPDATE REQUESTs
productRouter.patch('/product/name', authentication, adminAuthorization, updateProductName);
productRouter.patch('/product/desc', authentication, adminAuthorization, updateProductDesc);
productRouter.patch('/product/quantity', authentication, adminAuthorization, updateProductQuantity);

//SEARCH
productRouter.get('/product/search', authentication, searchProduct);