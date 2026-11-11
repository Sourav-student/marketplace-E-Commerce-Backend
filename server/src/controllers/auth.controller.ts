import type { Request, Response } from "express";
import { createUserService, verifyUserService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";

export const createUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createUserService(req.body);

    return res.status(201).json({
      message: "user account created successfully",
      success: true,
      user: result
    });
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await verifyUserService(req.body);

    res.cookie("refreshToken", result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      access_token: result.access_token,
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({
      message : "logout successfully",
      success : true,
    });
  }
);