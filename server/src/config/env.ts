import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL!,
  ACCESS_SECRET: process.env.JWT_SECRET_ACCESS!,
  CLIENT_URL: process.env.CLIENT_URL!,
  ACCESS_EXPIRE: process.env.JWT_EXPIRE_ACCESS!,
  REFRESH_SECRET: process.env.JWT_SECRET_REFRESH!,
  REFRESH_EXPIRE: process.env.JWT_EXPIRE_REFRESH!,
  REDIS_URL: process.env.REDIS_URL!,
  REDIS_RETRY_LIMIT: process.env.REDIS_RETRY_LIMIT!,
  TRUST_PROXY: process.env.TRUST_PROXY!,
  CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_SECRET : process.env.CLOUDINARY_SECRET!,
  CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME!
};