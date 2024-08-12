"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Registra las escalas y elementos que necesitas
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define el tipo de datos para las métricas
type Metric = {
  metric: { __name__: string; instance: string; job: string; };
  value: [number, string]; // El primer elemento es el timestamp, el segundo es el valor
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all'); // Cambia a la URL completa
        setMetrics(response.data.data.result); // Asegúrate de acceder correctamente a los datos
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
    fetchData();
  }, []);

  // Configuración de datos para el gráfico
  const data = {
    labels: metrics.map(metric => new Date(metric.value[0] * 1000).toLocaleString()), // Convierte el timestamp a una fecha legible
    datasets: [
      {
        label: 'Metric',
        data: metrics.map(metric => Number(metric.value[1])), // Asegúrate de que esto sea numérico
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  // Renderiza el gráfico
  return <Line data={data} />;
};

export default Dashboard;
