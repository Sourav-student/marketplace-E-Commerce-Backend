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
  REFRESH_EXPIRE: process.env.JWT_EXPIRE_REFRESH!
};