import { createClient } from "redis";
import { env } from "./env";

const redisClient = createClient({
  url: env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis ready!");
});

export const connectRedis = async () => {
  try {
    console.log("Redis connection starting...");

    console.log("Redis URL:", env.REDIS_URL);

    await redisClient.connect();

    console.log("Redis connection successful!");
    console.log("Is Open:", redisClient.isOpen);
    console.log("Is Ready:", redisClient.isReady);
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
};

export default redisClient;