import express, { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import { corsConfig } from './config/cors';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRouter } from './routes/auth.route';
import { userRoute } from './routes/user.route';
import { categoryRouter } from './routes/category.route';
import { rateLimiter } from './middlewares/rateLimiter';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsConfig);

// Global rate limiter
app.use(
  rateLimiter({
    windowMs: 60 * 1000, //1 min
    maxRequests: 100, //100 requests
  })
);

//All routes
app.use('/api/v1/auth/user', authRouter);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin/category', categoryRouter);

//Middlewares for error
app.use(errorMiddleware);

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

app.use("/api/v1/{*splat}", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});