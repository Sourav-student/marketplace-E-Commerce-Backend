import { Request, Response, NextFunction } from "express";

import { httpRequestsTotal, httpRequestDuration } from "../config/prometheus";

export const metricsMiddleware = ( req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration =
      Number(process.hrtime.bigint() - start) / 1e9;

    // Use route templates instead of raw URLs.
    const route = req.route
      ? `${req.baseUrl}${req.route.path}`
      : "unmatched";

    const labels = {
      method: req.method,
      route,
      status: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);

    httpRequestDuration.observe(labels, duration);
  });

  next();
};