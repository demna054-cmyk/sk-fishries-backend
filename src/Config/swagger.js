import swaggerJsdoc from "swagger-jsdoc";
import envVars from "./env-vars.js";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Raizety API",
      version: "1.0.0",
    },
    // servers: [
    //   {
    //     url: "http://localhost:3090/",
    //     description: "Local server",
    //   },
    //   {
    //     url: envVars.base_url,
    //     description: "Live server",
    //   },
    // ],
  },
  // looks for configuration in specified directories
  apis: ["./src/Router/*.js"], // Path to the API routes
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
