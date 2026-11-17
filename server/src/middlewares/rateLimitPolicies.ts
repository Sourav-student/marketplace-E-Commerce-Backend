import { Response, Request } from "express";
import { rateLimiter } from "./rateLimiter";

// General IP-based rate limiter
export const globalRateLimiter = rateLimiter({
  name: "global",
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req : Request) => req.ip || "unknown",
  failureMode: "open",
  skip: (req : Request) => req.path === "/health",
});

// Authentication rate limiter
export const authRateLimiter = rateLimiter({
  name: "auth",
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  keyGenerator: (req : Request) => req.ip || "unknown",
  failureMode: "closed",
});

// Signup rate limiter
export const signupRateLimiter = rateLimiter({
  name: "signup",
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  keyGenerator: (req : Request) => req.ip || "unknown",
  failureMode: "closed",
});

// Product search rate limiter
export const productSearchRateLimiter = rateLimiter({
  name: "product-search",
  windowMs: 60 * 1000,
  maxRequests: 60,
  keyGenerator: (req : Request) => req.ip || "unknown",
  failureMode: "open",
});

// Authenticated user rate limiter
export const userRateLimiter = rateLimiter({
  name: "authenticated-user",
  windowMs: 60 * 1000,
  maxRequests: 100,
  keyGenerator: (req : Request, res : Response) => {
    return res.locals.user?.id || req.ip || "unknown";
  },

  failureMode: "open",
});

// Payment rate limiter
export const paymentRateLimiter = rateLimiter({
  name: "payment",
  windowMs: 60 * 1000,
  maxRequests: 10,
  keyGenerator: (req : Request, res : Response) => {
    return res.locals.user?.id || req.ip || "unknown";
  },
  failureMode: "closed",
});