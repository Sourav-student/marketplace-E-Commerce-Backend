import { Request, Response, NextFunction, RequestHandler } from "express";
import redisClient from "../config/redis";
import { redisCommandDuration, redisErrorsTotal, rateLimitExceeded } from "../config/prometheus";

// Atomic Redis Lua script
const RATE_LIMIT_SCRIPT = `
    local current = redis.call("INCR", KEYS[1])
    if current == 1 then
        redis.call("PEXPIRE", KEYS[1], ARGV[1])
    end
    local ttl = redis.call("PTTL", KEYS[1])
    return {current, ttl}
`;

type FailureMode = "open" | "closed";
interface RateLimiterOptions {
  name: string;
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request, res: Response) => string;
  failureMode?: FailureMode;
  skip?: (req: Request) => boolean;
}

export const rateLimiter = ({ name, windowMs, maxRequests, keyGenerator, failureMode = "closed", skip }: RateLimiterOptions): RequestHandler => {

  if (windowMs <= 0 || maxRequests <= 0) {
    throw new Error("Invalid rate limiter configuration");
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Skip selected requests
      if (skip?.(req)) {
        return next();
      }

      // Generate unique identifier
      const identifier = keyGenerator(req, res);
      if (!identifier) {
        return res.status(400).json({
          success: false,
          message: "Unable to identify request",
        });
      }

      // Generate Redis key
      const key = `rate-limit:${name}:${encodeURIComponent(identifier)}`;
      // Track Redis execution time
      const start = process.hrtime.bigint();
      let result: number[];

      try {
        // Execute atomic Lua script
        result = await redisClient.eval(
          RATE_LIMIT_SCRIPT,
          {
            keys: [key],
            arguments: [String(windowMs)],
          }
        ) as number[];
      } catch (error) {
        redisErrorsTotal.inc();
        throw error;
      } finally {
        const duration =
          Number(process.hrtime.bigint() - start) / 1e9;
        redisCommandDuration.observe(
          { command: "rate_limit_eval" },
          duration
        );
      }

      const [current, ttl] = result;
      // Calculate remaining requests
      const remaining = Math.max(0, maxRequests - current);

      const resetSeconds = Math.max(0, Math.ceil(ttl / 1000));

      // Standard rate-limit headers
      res.setHeader("RateLimit-Limit", maxRequests);
      res.setHeader("RateLimit-Remaining", remaining);
      res.setHeader("RateLimit-Reset", Math.ceil(Date.now() / 1000) + resetSeconds);

      // Reject excessive requests
      if (current > maxRequests) {
        // Prometheus metric
        rateLimitExceeded.inc({
          policy: name,
        });

        res.setHeader(
          "Retry-After",
          Math.max(1, resetSeconds)
        );

        return res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
          retryAfter: resetSeconds,
        });
      }

      return next();
    } catch (error) {
      console.error(
        `[RateLimiter:${name}] Redis error:`,
        error
      );

      // Fail-open: allow request to continue
      if (failureMode === "open") {
        return next();
      }

      // Fail-closed: reject request
      return res.status(503).json({
        success: false,
        message: "Rate limiting service temporarily unavailable",
      });
    }
  };
};