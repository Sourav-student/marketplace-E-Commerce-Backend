import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller";
import { authentication } from "../middlewares/authentication.middleware";
import { rateLimiter } from "../middlewares/rateLimiter";

export const authRouter = Router();

authRouter.post('/register', createUser);
authRouter.post('/login', rateLimiter({windowMs : 15*60*1000, maxRequests : 5}), loginUser);
authRouter.post('/logout', rateLimiter({windowMs : 15*60*1000, maxRequests : 5}),  authentication, logoutUser);