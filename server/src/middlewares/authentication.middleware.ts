import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { decodeJwtToken } from "../utils/auth.utils";
import { TokenType } from "../types/types";

export async function authentication(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: Access token required", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token missing", 401);
    }

    const decoded = await decodeJwtToken(token);

    if (typeof decoded === "string" || !decoded ||
      typeof decoded.id !== "string"
    ) {
      throw new AppError("Invalid access token", 401);
    }

    res.locals.user = decoded as TokenType;

    next();
  } catch (error) {
    next(error);
  }
}