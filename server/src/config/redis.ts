import { createClient } from "redis";
import { env } from "./env";
import { redisConnectionStatus, redisErrorsTotal } from "./prometheus";

const redisClient = createClient({
  url: env.REDIS_URL || "redis://localhost:6379",

  socket: {
    reconnectStrategy: (retries) => {
      const retryLimit = Number(
        env.REDIS_RETRY_LIMIT || 10
      );

      if (retries > retryLimit) {
        console.error("Redis retry limit exceeded");
        return new Error("Redis connection failed");
      }

      return Math.min(retries * 500, 5000);
    },
  },

  disableOfflineQueue: true,
});

redisClient.on("ready", () => {
  redisConnectionStatus.set(1);
  // console.log("Redis connection ready");
});


redisClient.on("error", (error) => {
  redisErrorsTotal.inc();
  // console.error("Redis error:", error.message);
});

redisClient.on("end", () => {
  redisConnectionStatus.set(0);
  // console.warn("Redis connection closed");
});

redisConnectionStatus.set(0);

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const isRedisReady = () => redisClient.isReady;

export const disconnectRedis = async () => {
  if (redisClient.isOpen) {
    await redisClient.close();
  }
};

export default redisClient;