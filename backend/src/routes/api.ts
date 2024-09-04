import express from "express"; 
import containers from "./containers";

var app = express();

app.use("/containers", containers);

export default app;