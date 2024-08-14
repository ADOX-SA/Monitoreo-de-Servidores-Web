import express from "express"; 
import containers from "./containers";
import metrics from "./metrics";

var app = express();

app.use("/containers", containers);
app.use("/metrics", metrics);


export default app;