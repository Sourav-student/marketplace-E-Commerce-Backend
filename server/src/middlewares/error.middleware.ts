import { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/app-error";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Duplicate value already exists";
        break;

      case "P2025":
        statusCode = 404;
        message = "Requested record not found";
        break;

      case "P2003":
        statusCode = 400;
        message = "Invalid related record";
        break;
    }
  } else if (err instanceof Error && process.env.NODE_ENV !== "production") {
    message = err.message;
  }

  console.error(err);

  return res.status(statusCode).json({
    success: false,
    message,
    // ...(process.env.NODE_ENV !== "production" &&
    //   err instanceof Error && { stack: err.stack }),
  });
};
