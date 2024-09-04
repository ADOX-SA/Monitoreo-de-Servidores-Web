import express from "express";  
import { getContainerMetricsHandler } from "../controllers/containers.controller";

var router = express.Router();

router.get("/all", getContainerMetricsHandler);

export default router;
