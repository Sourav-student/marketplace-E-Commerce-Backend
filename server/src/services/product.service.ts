import { ProductDataType } from "../types/types";

export async function addProduct(data: ProductDataType, seller_id : string) {
   const {product_name, price, quantity, tags, category_id, } = data;
}