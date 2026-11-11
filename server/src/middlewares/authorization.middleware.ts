import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";

export const adminAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = res.locals.user;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      throw new AppError("not excess to change OR add new category", 409);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const sellerAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = res.locals.user;

    if (role !== "SELLER") {
      throw new AppError("not excess to change add new category", 403);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};