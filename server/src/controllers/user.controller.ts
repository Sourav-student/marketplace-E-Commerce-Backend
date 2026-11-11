import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { TokenType } from "../types/types";
import { createAddressService, deleteAddressService, getAllAddressService, getOneAddressService, getUserInfoService, updateAddressService, updateMobileNumberService, updateUserNameService } from "../services/user.service";

export const getUserInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const user = res.locals.user as TokenType;
    const userInfo = await getUserInfoService(user.id);

    return res.status(200).json({
      success: true,
      message: "user information fetched successfully",
      userInfo,
    })
  }
);

export const updateMobileNumber = asyncHandler(
  async (req: Request, res: Response) => {
    const { mobile_no, alternative_mobile_no } = req.body;

    const data = { mobile_no, alternative_mobile_no };

    const updatedUser = await updateMobileNumberService(data, res.locals.user.id);

    return res.status(200).json({
      message: "updated mobile number successfully",
      success: true,
      updatedUser
    });
  }
);

export const updateUserName = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedUser = await updateUserNameService(req.body.name, res.locals.user.id);

    return res.status(200).json({
      message: "user name updated successfully!",
      success: true,
      data: updatedUser
    });
  }
);

export const createAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await createAddressService(req.body, res.locals.user.id);

    return res.status(201).json({
      message: "created successfully!",
      success: true,
      address
    });
  }
);

export const getAllAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const addresses = await getAllAddressService(res.locals.user.id);

    return res.status(200).json({
      message: `all addresses fetch with user_id : ${res.locals.user.id}`,
      success: true,
      addresses
    });
  }
);

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedaddress = await updateAddressService(req.body, req.query.address_id as string, res.locals.user.id);

    return res.status(200).json({
      message: "update successfully!",
      success: true,
      updatedaddress
    });
  }
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const deleted = await deleteAddressService(req.query.address_id as string, res.locals.user.id);

    return res.status(200).json({
      message: "successfully deleted!",
      success: true,
    });
  }
);

export const getOneAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const address = await getOneAddressService(req.query.address_id as string, res.locals.user.id);

    return res.status(200).json({
      message: "fetch address successfully",
      success: true,
      address : address
    });
  }
);