import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller";
import { authentication } from "../middlewares/authentication.middleware";

export const authRouter = Router();

authRouter.post('/register', createUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', authentication, logoutUser);