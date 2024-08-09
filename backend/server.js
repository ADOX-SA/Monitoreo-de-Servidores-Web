const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Importa el paquete cors
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const prometheusApiUrl = process.env.PROMETHEUS_API_URL;

// Configura CORS para permitir solicitudes desde tu frontend
app.use(cors({
  origin: 'http://localhost:3001', // Ajusta esto según la URL de tu frontend
}));

app.get('/api/metrics', async (req, res) => {
  try {
    const query = 'up'; // Cambia esto por la consulta que desees
    const response = await axios.get(`${prometheusApiUrl}/api/v1/query?query=${query}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: 'Error fetching metrics' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} => 🌎`);
});
