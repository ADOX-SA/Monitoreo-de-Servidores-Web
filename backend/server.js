const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const prometheusApiUrl = process.env.PROMETHEUS_API_URL;

app.get('/metrics', async (req, res) => {
  try {
    const response = await axios.get(`${prometheusApiUrl}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching metrics' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} => 🌎`);
});
