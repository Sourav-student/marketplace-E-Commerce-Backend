import express, { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import { corsConfig } from './config/cors';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.route';
import { userRoute } from './routes/user.route';
import { categoryRouter } from './routes/category.route';
import { globalRateLimiter } from './middlewares/rateLimitPolicies';
import metricsRouter from './routes/metrics.router';
import { productRouter } from './routes/product.route';
export const app = express();

// Configure only according to your trusted proxy topology.
// For local development, leave this disabled.
if (process.env.TRUST_PROXY === "1") {
  app.set("trust proxy", 1);
}

app.use(express.json());
app.use(cookieParser());
app.use(corsConfig);

//health route
app.use('/api/v1/health', (req : Request, res : Response) => {
  try {
    return res.status(200).json({
      message : "server is running | health is good",
      success : true,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message : "server is not running | health is bad",
      success : false,
    })
  }
})

app.use(globalRateLimiter);

//All routes
app.use('/api/v1/metrics', metricsRouter);
app.use('/api/v1/auth/user', authRouter);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin/category', categoryRouter);
app.use('/api/v1', productRouter);

//Middlewares for error
app.use(errorMiddleware);

app.use("/api/v1/{*splat}", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;