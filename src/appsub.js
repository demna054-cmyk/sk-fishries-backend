// Libraries
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { error, notFound } from "./Router/Middleware/ErrorMiddleware.js";
import connectDB from "./DB/index.js";
import Routes from "./Router/routes.js";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./Config/swagger.js";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

export let app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/", express.static("Uploads"));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.get("/", (req, res) => res.send("Raizety Server is healthy! 💪"));

// Swagger Page
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
// Documentation in JSON format
app.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
// Connect To Database
connectDB();

// * Routes

app.use("/api/v1", Routes());

app.use(notFound);
app.use(error);
