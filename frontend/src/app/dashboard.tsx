"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Registra las escalas y elementos que necesitas
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

type Metric = {
    value: [number, string];
};

const Dashboard = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        const fetchData = async (): Promise<Metric[]> => {
            const response = await axios.get<Metric[]>('/api/metrics');
            return response.data;
        };      
        fetchData().then(setMetrics);
    }, []);

    const data = {
        labels: metrics.map((_, index) => `Label ${index + 1}`),
        datasets: [
            {
                label: 'Metric',
                data: metrics.map(metric => metric.value[1]), // Asegúrate de que esto sea numérico
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return <Line data={data} />;
};

export default Dashboard;
