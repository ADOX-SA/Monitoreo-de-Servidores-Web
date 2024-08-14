import express from "express";  
import { metrics } from "../controllers/metrics.controller";

var router = express.Router();

router.get("/", metrics);


export default router;
