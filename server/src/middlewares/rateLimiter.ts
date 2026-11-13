import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";
import { RateLimitOptions } from "../types/types";

const script = `
    local current = redis.call("INCR", KEYS[1])

    if current == 1 then
        redis.call("PEXPIRE", KEYS[1], ARGV[1])
    end

    local ttl = redis.call("PTTL", KEYS[1])

    return {current, ttl}
`;


export const rateLimiter = ({
  windowMs = 60 * 1000,
  maxRequests = 100,
}: RateLimitOptions = {}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.socket.remoteAddress || "unknown";

      const key = `rate-limit:${ip}`;

      const result = await redisClient.eval(script, {
        keys: [key],
        arguments: [String(windowMs)],
      }) as number[];

      const [current, ttl] = result;

      const remaining = Math.max(0, maxRequests - current);

      res.setHeader("RateLimit-Limit", maxRequests);
      res.setHeader("RateLimit-Remaining", remaining);
      res.setHeader(
        "RateLimit-Reset",
        Math.ceil(Date.now() / 1000 + ttl / 1000)
      );

      if (current > maxRequests) {
        res.setHeader("Retry-After", Math.ceil(ttl / 1000));

        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);

      // Fail closed: do not allow unmetered requests
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable.",
      });
    }
  };
};