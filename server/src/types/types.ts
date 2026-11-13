export type TokenType = {
  email: string, username: string, id: string, role: string
}

export type UserDataType = {
  email: string, username: string, password: string, mobile_no: string, name?: string;
  alternative_mobile_no?: string;
}

export type VerifyUserDataType = {
  email?: string, username?: string, password: string
}

export type MobileType = {
  mobile_no?: string,
  alternative_mobile_no?: string
}

export type CategoryDataType = {
  category_name: string
}

export type AddressDataType = {
  addressLine1: string,
  addressLine2?: string,
  city: string,
  state: string,
  country: string,
  postalCode: string
}

export type ProductDataType = {
  seller_id: string
  category_id: string
  product_name: string
  price: number
  quantity: number
  description?: string
  image_url: string
  tags: string
}

export type RateLimitOptions = {
  windowMs?: number;
  maxRequests?: number;
}