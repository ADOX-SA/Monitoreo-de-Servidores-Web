import express from 'express';
import path from 'path';
import cors from 'cors'; // Importa cors
import { config } from './config/index';
import api from './routes/api';

const app = express();

// Habilita CORS para todas las rutas
app.use(cors()); // Esto permitirá todas las solicitudes CORS

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

app.listen(config.http.port, () => {
    console.log(`Server running on port ${config.http.port} => 🌎`);
});
