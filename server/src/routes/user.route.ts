import { Router } from "express";
import { authentication } from "../middlewares/authentication.middleware";
import { createAddress, deleteAddress, getAllAddresses, getOneAddress, getUserInfo, updateAddress, updateMobileNumber, updateUserName } from "../controllers/user.controller";

export const userRoute = Router();

userRoute.get('/profile', authentication, getUserInfo);
userRoute.patch('/update/mobile_no', authentication, updateMobileNumber);
userRoute.patch('/update/name', authentication, updateUserName);

//Address routes
userRoute.post('/address', authentication, createAddress);
userRoute.get('/address/all', authentication, getAllAddresses);
userRoute.get('/address', authentication, getOneAddress);
userRoute.patch('/address/update', authentication, updateAddress);
userRoute.delete('/address/delete', authentication, deleteAddress);