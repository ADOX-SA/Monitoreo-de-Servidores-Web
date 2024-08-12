import express from "express";  
import { images } from "../controllers/containers.controller";

var router = express.Router();

router.get("/all", images);

export default router;
