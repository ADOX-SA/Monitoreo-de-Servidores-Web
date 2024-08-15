"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContainerCard from './ContainerCard';
import styles from './conteinerCard.module.css';

type Port = {
  IP: string;
  PrivatePort: number;
  PublicPort: number;
  Type: string;
};

type NetworkIO = {
  rx_bytes: number;
  rx_packets: number;
  rx_errors: number;
  rx_dropped: number;
  tx_bytes: number;
  tx_packets: number;
  tx_errors: number;
  tx_dropped: number;
};

type Metrics = {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  uptime: number;
};

type Container = {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: Port[];
  metrics: Metrics;
};

const Dashboard = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/metrics/');
        const data = response.data;

        // Transformar los datos recibidos al formato esperado por el frontend
        const transformedData = data.uptime.map((uptimeEntry: any) => {
          const cpu = parseFloat(data.cpu[0].value[1]);
          const memoryUsage = parseFloat(data.memory[0].value[1]);
          const diskUsage = parseFloat(data.disk[0].value[1]);
          const networkIn = parseFloat(data.networkIn[0].value[1]);
          const networkOut = parseFloat(data.networkOut[0].value[1]);

          return {
            id: uptimeEntry.metric.id,
            name: uptimeEntry.metric.name,
            image: uptimeEntry.metric.image,
            status: "running", // Puedes actualizar esto según los datos reales si lo tienes
            ports: [], // Suponiendo que tienes que agregar los puertos por separado
            metrics: {
              cpuUsage: cpu,
              memoryUsage: memoryUsage,
              diskUsage: diskUsage,
              networkIn: networkIn,
              networkOut: networkOut
            },
          };
        });

        setContainers(transformedData);
      } catch (error) {
        console.error("Error fetching containers:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      {containers.map(container => (
        <ContainerCard key={container.id} container={container} />
      ))}
    </div>
  );
};

export default Dashboard;
