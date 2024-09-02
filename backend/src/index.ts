import express from 'express';
import path from 'path';
import cors from 'cors';
import { config } from './config/index';
import api from './routes/api';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000", // Cambia esto por la URL de tu frontend
    methods: ["GET", "POST"]
  }
});

// Habilita CORS para todas las rutas
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

// Función para obtener datos de la API
const fetchDataFromAPI = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/containers/all');
    return response.data; // Devuelve los datos de la API
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return null;
  }
};

io.on('connection', (socket) => {
  console.log('User connected 😊');

  // Emite datos de la API periódicamente
  const emitData = async () => {
    const data = await fetchDataFromAPI();
    if (data) {
      socket.emit('data', data);
    }
  };

  emitData(); // Envía datos inmediatamente al conectar

  const intervalId = setInterval(emitData, 5000); // Envía datos cada 5 segundos

  socket.on('disconnect', () => {
    console.log('User disconnected 😒');
    clearInterval(intervalId); // Limpia el intervalo cuando el cliente se desconecta
  });
});

server.listen(config.http.port, () => {
  console.log(`Server running on port ${config.http.port} => 🌎`);
});
