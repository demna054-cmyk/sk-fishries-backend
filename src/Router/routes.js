import { Router } from "express";
import authRouter from "./auth.router.js";
import truckRouter from "./truck.router.js";
import recordRouter from "./record.router.js";
import marketRouter from "./market.router.js";
import expenseRouter from "./expense.routes.js";
import chequeRouter from "./cheque.routes.js";
import cashflowRouter from "./cashflow.routes.js";

const Routes = () => {
  const router = Router();

  router.use("/auth", authRouter);
  router.use("/truck", truckRouter);
  router.use("/record", recordRouter);
  router.use("/market", marketRouter);
  router.use("/expense", expenseRouter);
  router.use("/cheque", chequeRouter);
  router.use("/cashflow", cashflowRouter);

  return router;
};
export default Routes;
