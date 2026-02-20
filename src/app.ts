// import the express application and type definition
import express, { Express } from "express";
import morgan from "morgan";

import eventRoutes from "./api/v1/routes/eventRoutes";

// initialize the express application
const app: Express = express();

/**
 * Interface for health check response
 * Defines the structure of the health response object
 */
interface HealthCheckResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
}

// ================= Middleware START =================

// HTTP request logger middleware
app.use(morgan("combined"));

// Parse incoming JSON bodies
app.use(express.json());

// ================= Middleware END =================

// Root endpoint (optional but good practice)
app.get("/", (_req, res) => {
  res.send("Event Registration API is running");
});

/**
 * Health check endpoint that returns server status information
 */
app.get("/api/v1/health", (_req, res) => {
  const healthData: HealthCheckResponse = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  };

  res.json(healthData);
});

// ================= Route Imports START =================

// "/api/v1/events" will prefix all event routes
app.use("/api/v1/events", eventRoutes);

// ================= Route Imports END =================

export default app;
