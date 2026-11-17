import "dotenv/config";
import app from "./app";
import { connectRedis, disconnectRedis, isRedisReady } from "./config/redis";
import { Request, Response } from "express";
const PORT = Number(process.env.PORT || 8000);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  // Start Redis connection
  connectRedis()
    .then(() => {
      console.log("Redis connected successfully");
    })
    .catch((error) => {
      console.error("Redis initial connection failed:", error);
      console.log("Express remains running; Redis retry is managed separately.");
    });
});

// Readiness endpoint
app.get("/ready", (req : Request, res : Response) => {
  const redisReady = isRedisReady();

  res.status(redisReady ? 200 : 503).json({
    success: redisReady,
    server: "running",
    redis: redisReady ? "connected" : "unavailable",
  });
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down...`);

  server.close(async () => {
    try {
      await disconnectRedis();
      console.log("Redis disconnected");
      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));