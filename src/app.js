import { createServer } from "https";
import { createServer as localServer } from "http";
import { app } from "./appsub.js";
import cluster from "cluster";
import os from "os";
import envVars from "./Config/env-vars.js";
import colors from "colors";
import logger from "./Config/logger.js";

const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Master ${process.pid} is running`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died`);
//   });
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

httpServer.listen(port, async () => {
  logger.info(
    `${envVars.env.toUpperCase()} Worker ${process.pid} Listening on PORT ${
      envVars.port
    }`.yellow
  );
});
