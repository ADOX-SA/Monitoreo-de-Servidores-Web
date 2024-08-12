import express from 'express';
import path from 'path';
import { config } from './config/index';
import api from './routes/api';

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

app.listen(config.http.port, () => {
    console.log(`Server running on port ${config.http.port} => 🌎`);
});
