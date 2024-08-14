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
  memoryLimit: number;
  memoryPercentage: number;
  networkIO: {
    eth0: NetworkIO;
  };
  blockIO: {
    io_service_bytes_recursive: any[];
    io_serviced_recursive: any[];
    io_queue_recursive: any[];
    io_service_time_recursive: any[];
    io_wait_time_recursive: any[];
    io_merged_recursive: any[];
    io_time_recursive: any[];
    sectors_recursive: any[];
  };
};

type Container = {
  id: string;
  name: string;
  image: string;
  status: string;
  ports: Port[];
  metrics: Metrics; 
};

// Componente Dashboard permanece igual
const Dashboard = () => {
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get('http://localhost:5000/api/containers/all');
        setContainers(response.data); // Ajusta según la estructura de tu respuesta
      } catch (error) {
        console.error("Error fetching containers:", error);
      }
    };
    fetchData();
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
