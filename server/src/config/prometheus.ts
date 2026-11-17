import * as client from "@prometheus-io/client";

// Prometheus client libraries are software packages that let you add monitoring instrumentation directly to your application code. They track internal metrics—like request counts or latency—and expose them on an HTTP /metrics endpoint so a Prometheus server can scrape them.

// Registry
export const register = new client.Registry();

// Default Node.js metrics
client.collectDefaultMetrics({
  register,
  prefix: "marketplace_",
});

// HTTP requests counter
export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

// HTTP request duration
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [
    0.01,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2,
    5,
  ],
  registers: [register],
});

// Rate limit counter
export const rateLimitExceeded = new client.Counter({
  name: "rate_limit_exceeded_total",
  help: "Total requests blocked by rate limiting",
  labelNames: ["policy"],
  registers: [register],
});

// Redis connection status
export const redisConnectionStatus = new client.Gauge({
  name: "redis_connection_status",
  help: "Redis connection status",
  registers: [register],
});

// Redis command duration
export const redisCommandDuration = new client.Histogram({
  name: "redis_command_duration_seconds",
  help: "Redis command execution duration",
  labelNames: ["command"],
  buckets: [
    0.001,
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.5,
    1,
  ],
  registers: [register],
});

// Redis errors
export const redisErrorsTotal = new client.Counter({
  name: "redis_errors_total",
  help: "Total Redis errors",
  registers: [register],
});