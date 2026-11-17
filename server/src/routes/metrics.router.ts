import { Router } from "express";
import { register } from "../config/prometheus";

const metricsRouter = Router();

metricsRouter.get("/", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);

  res.status(200).send(await register.metrics());
});

export default metricsRouter;