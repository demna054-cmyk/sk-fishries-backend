// app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "https";
import { createServer as localServer } from "http";
import cluster from "cluster";
import os from "os";
import fs from "fs";
import colors from "colors";

import { error, notFound } from "./Router/Middleware/ErrorMiddleware.js";
import connectDB from "./DB/index.js";
import Routes from "./Router/routes.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./Config/swagger.js";
import envVars from "./Config/env-vars.js";
import logger from "./Config/logger.js";

// ----------- Setup Express App -------------
export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/", express.static("Uploads"));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Health check route
app.get("/", (req, res) => res.send("Raizety Server is healthy! 💪"));

// Swagger
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Routes
app.use("/api/v1", Routes());

// Error handlers
app.use(notFound);
app.use(error);

// Async init function
async function initApp() {
  await connectDB();
}

// ----------- Start Server -------------
async function startServer() {
  await initApp();

  const numCPUs = os.cpus().length;

  // Optional: Cluster setup
  // if (cluster.isPrimary) {
  //   console.log(`Master ${process.pid} is running`);
  //   for (let i = 0; i < numCPUs; i++) cluster.fork();
  //   cluster.on("exit", (worker) => console.log(`Worker ${worker.process.pid} died`));
  // } else {
  let httpServer = null;

  if (process.env.APP !== "production") {
    httpServer = localServer(app);
  } else {
    httpServer = createServer(
      {
        key: fs.readFileSync(envVars.ssl.key),
        cert: fs.readFileSync(envVars.ssl.certificate),
        ca: fs.readFileSync(envVars.ssl.ca),
      },
      app
    );
  }

  const port = envVars.port || 3050;

  httpServer.listen(port, () => {
    logger.info(
      `${envVars.env.toUpperCase()} Worker ${process.pid} Listening on PORT ${port}`.yellow
    );
  });
  // }
}

// Run the server
startServer();
