import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller";
import { authentication } from "../middlewares/authentication.middleware";
import { rateLimiter } from "../middlewares/rateLimiter";
import { authRateLimiter, signupRateLimiter } from "../middlewares/rateLimitPolicies";

export const authRouter = Router();

authRouter.post('/register', signupRateLimiter, createUser);
authRouter.post('/login', authRateLimiter, loginUser);
authRouter.post('/logout', authentication, logoutUser);